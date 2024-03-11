from flask import Flask, request, jsonify
from flask_cors import CORS
import pika
import json
import amqp_connection
import os

app = Flask(__name__)
CORS(app)

hostName = "notification-rabbitmq" # host name
exchangeName = "email_topic" # exchange name
exchangeType = "topic" # - use a 'topic' exchange to enable interaction

# create a connection and a channel to the broker to publish messages to
connection = amqp_connection.create_connection(hostName) 
channel = connection.channel()

# if the exchange is not yet created, exit the program
if not amqp_connection.check_exchange(channel, exchangeName, exchangeType):
    print("\nCreate the 'Exchange' before running this microservice. \nExiting the program.")
    sys.exit(0)  # Exit with a success status


def sendMessageToQueue(messageDictionary):
    # Decode dictionary
    messageInfo = json.dumps(messageDictionary)
    print("Decoded JSON data: ", messageInfo)
    # Send to rabbitMQ
    channel.basic_publish(exchange=exchangeName, routing_key="email.yes", body=messageInfo, properties=pika.BasicProperties(delivery_mode = 2)) 

    # Return response
    return {
        "code": 201,
        "data": {"messageInfo": messageInfo},
        "message": "Processing of Email Notification success."
    }


def extractJSON(request):
    if request.is_json:
        try:
            # Convert to JSON
            requestJSON = request.get_json()
            print("Decoded JSON data: ", requestJSON)
            return requestJSON

        except Exception as e:
            # Unexpected error in code
            exc_type, exc_obj, exc_tb = sys.exc_info()
            fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
            ex_str = str(e) + " at " + str(exc_type) + ": " + fname + ": line " + str(exc_tb.tb_lineno)
            print(ex_str)
            return None
    
    # not JSON data 
    return None

def createEmailMessage(emailType, jsonData):
    result = {
        "emailType": emailType,
        "email": "esdt42024@gmail.com"
    }
    return result


@app.route("/listing/created", methods=['POST'])
def listing_created():
    if not request.is_json:        
        return jsonify({
            "code": 400,
            "message": "Invalid JSON input: " + str(request.get_data())
        }), 400

    print("\nReceived /listing/created request")
    # Extract JSON data from request
    jsonData = extractJSON(request)
    if jsonData == None:
        return jsonify({
            "code": 400,
            "message": "Invalid JSON input: " + str(request.get_data())
        }), 400
    # Convert JSON data to email data
    emailData = createEmailMessage("listingCreated", jsonData)

    # Send to Queue
    messageResult = sendMessageToQueue(emailData)
    print('\n------------------------')
    print('\n Result : ', messageResult)
    return jsonify(messageResult), messageResult["code"]


@app.route("/bid/success", methods=['POST'])
def bid_success():
    pass

@app.route("/bid/outbidded", methods=['POST'])
def bid_outbidded():
    pass

@app.route("/auction/end", methods=['POST'])
def auction_end():
    pass

@app.route("/payment/success", methods=['POST'])
def payment_success():
    pass



if __name__ == "__main__":
    print("This is flask " + os.path.basename(__file__) + " for sending an email...")
    app.run(host="0.0.0.0", port=5001, debug=True)
    # Notes for the parameters: 
    # - debug=True will reload the program automatically if a change is detected;
    #   -- it in fact starts two instances of the same flask program, and uses one of the instances to monitor the program changes;
    # - host="0.0.0.0" allows the flask program to accept requests sent from any IP/host (in addition to localhost),
    #   -- i.e., it gives permissions to hosts with any IP to access the flask program,
    #   -- as long as the hosts can already reach the machine running the flask program along the network;
    #   -- it doesn't mean to use http://0.0.0.0 to access the flask program.
