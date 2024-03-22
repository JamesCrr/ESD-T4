from flask import Flask, jsonify, request, abort
import requests
from flasgger import Swagger

app = Flask(__name__)
# Initialize flasgger 
app.config['SWAGGER'] = {
    'title': 'Close auction API',
    'version': 1.0,
    "openapi": "3.0.2",
    'description': 'Allows udpating of auction'
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
    #Get listing from url
    if request.is_json:
        request_data = request.json
        listingId = request_data.get("listingId")
    # listingId = '37bc3e46-d1ec-4307-b0cd-514172e8d9a7'

    #Get highestBid, buyerId and sellerId from listing 
    listing_service_url = 'http://localhost:3001/getListing/' + listingId
    response = requests.get(listing_service_url)
    data = response.json()

    #Store data for further use
    highestBid = data.get("highestBid")
    buyerId = data.get("buyerId")
    sellerId = data.get("sellerId")

    #params needed for post following post request
    # params_json = {"highestBid": highestBid, "buyerId": buyerId, "sellerId": sellerId, "listingId":listingId}
    params_json = {"highestBid": 100, "buyerId": "7f3b428f-050c-446b-ac9d-7176b3f11b14", "sellerId": "3ae1a890-fa30-47c3-ac70-6a282d492b4b", "listingId":"13213113dadsdasda"}

    #Post request to payment complex microservice sending the listingid, userid of seller and buyer
    payment_service_url = 'http://localhost:3031/closeAuctionPost'
    response = requests.post(payment_service_url, params_json)

    if response.status_code == 200:
        print(response.json())

    # # Step 1: Send GET request to "Bid" microservice to get bidders' User IDs
    # bid_service_url = 'http://localhost:3012/retrieve/all'
    # response = requests.get(bid_service_url, params={'listing_id': listing_id})
    # if response.status_code != 200:
    #     abort(500)

    # bidders = response.json().get('bidders')

    # # Step 2: Send POST request to "Listing" microservice to update listing status
    

    # # Step 3: Send GET request to "User" microservice to get bidders' contact information
    # user_service_url = 'http://user-service-url/get-contact-info'
    # response = requests.get(user_service_url, params={'bidders': bidders})
    # if response.status_code != 200:
    #     abort(500)

    # contact_info = response.json().get('contact_info')

    # # Step 4: Dispatch AMQP request to notify bidders
    # notification_service_url = 'http://notification-service-url/notify-bidders'
    # amqp_payload = {
    #     'listing_id': listing_id,
    #     'contact_info': contact_info
    # }
    # response = requests.post(notification_service_url, json=amqp_payload)
    # if response.status_code != 200:
    #     abort(500)

    return jsonify({'message': 'Auction closed successfully'})

if __name__ == '__main__':
    app.run(debug=True)
