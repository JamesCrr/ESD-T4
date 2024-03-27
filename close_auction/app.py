from flask import Flask, jsonify, request, abort
import requests
from datetime import datetime
import pika
import json
from flasgger import Swagger

app = Flask(__name__)
# Initialize flasgger 
app.config['SWAGGER'] = {
    'title': 'Close auction API',
    'version': 1.0,
    "openapi": "3.0.2",
    'description': 'Allows closing of auction'
}
swagger = Swagger(app)

# Route for closing the auction
@app.route('/close_auction', methods=['POST'])
def close_auction():
    """
    Close Auction Endpoint
    
    This endpoint is used to close an auction and perform certain operations.

    ---
    parameters:
      - name: body
        in: body
        description: Request body for closing auction
        required: true
        schema:
          type: object
          properties:
            listingId:
              type: string
              description: The ID of the listing.

    responses:
      200:
        description: Auction closed successfully
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  description: A message indicating the success or failure of the operation.
    """
    # Your function logic here
    error = ""
    #Get listing from url
    if request.is_json:
        request_data = request.json
        listingId = request_data.get("listingId")
    # listingId = '37bc3e46-d1ec-4307-b0cd-514172e8d9a7'

    #Get highestBid, buyerId and sellerId from listing 
    listing_service_url = 'http://localhost:9999/getListing/' + listingId
    response = requests.get(listing_service_url)

    #check for response to do later
    if response.status_code == 200:
        print(response.json())
    else:
        error = "A"
        return jsonify({'error': error})
    
    data = response.json()
    
    #Store data for further use
    highestBid = data.get("highestBid")
    buyerId = data.get("buyerId")
    sellerId = data.get("sellerId")

    #params needed for post following post request
    params_json = {"highestBid": highestBid, "buyerId": buyerId, "sellerId": sellerId, "listingId":listingId}
    
    #Post request to payment complex microservice sending the listingid, userid of seller and buyer
    payment_service_url = 'http://localhost:3031/closeAuctionPost'
    response = requests.post(payment_service_url, json = params_json)

    #check for response to do later
    if response.status_code == 200:
        print(response.json())
    else:
        error = "B"
        return jsonify({'error': error})

    #update listing status
    listing_service_url = 'http://localhost:9999/updateListing/' + listingId
    date_time_created = datetime.now()
    params_json = {"status": False,
                   'autionEndDateTime': date_time_created.isoformat()
    }
    response = requests.put(listing_service_url, json = params_json)

    if response.status_code == 200:
        print(response.json())
    else:
        error = "C"
        return jsonify({'error': error})

    #Get all bidders userid
    bidding_service_url = "http://localhost:3012/retrieve/all"

    #hardcoding listingId for now
    listingId = "b9c6c471-227c-4b6e-8ee9-0c5536614c98"
    params_json = {"listingId":listingId}
    response = requests.get(bidding_service_url, params = params_json)
    data = response.json()
    print(data)
    userIdList = []
    for datafield in data:
        userIdList.append(datafield["userId"])
    print(userIdList)

    #update bidding status
    bidding_service_url = "http://localhost:3012/update/bids/" + listingId
    response = requests.patch(bidding_service_url)
    if response.status_code != 201:
        return error

    #get all emails
    user_service_url = "https://personal-swk23gov.outsystemscloud.com/User_API/rest/v1/users"
    emailList = []
    #hardcoding userids for now
    params_json = {"userIds": ["3ae1a890-fa30-47c3-ac70-6a282d492b4b","7f3b428f-050c-446b-ac9d-7176b3f11b14", "87ade5fc-7483-40ea-9a5a-8b2806a1211d"]}
    response = requests.post(user_service_url, json = params_json)
    if response.status_code == 200:
        data = response.json()["AuctionUsers"]
        for user in data:
            emailList.append(user["email"])

    #send email
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost', port=5672))
    channel = connection.channel()

    # Declare the exchange if not already declared
    channel.exchange_declare(exchange='email_topic', exchange_type='topic', durable=True)
    
    email_message = {
        "emailType": "AuctionEnded",
        "emailTarget": "jinkanglim23@gmail.com",
        "emailTitle": "Auction concluded!",
        "emailContent": "",
        "senderUserObject": {
            "username": "Pepe the frog"
        }
    }

    channel.basic_publish(exchange='email_topic', routing_key='email.listing', body=json.dumps(email_message))

    print(f"Message sent: {email_message} to email_topic with routing key of email.listing")

    return jsonify({'message': 'Auction closed successfully'})

if __name__ == '__main__':
    app.run(debug=True, port=8888)
