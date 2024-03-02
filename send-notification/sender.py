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


def processEmailNotification(emailRequest):
    emailInfo = json.dumps(emailRequest)
    print("Decoded JSON data: ", emailInfo)

    # Send to rabbitMQ
    channel.basic_publish(exchange=exchangeName, routing_key="email.yes", body=emailInfo, properties=pika.BasicProperties(delivery_mode = 2)) 

    # Return response
    return {
        "code": 201,
        "data": {"emailInfo": emailInfo},
        "message": "Processing of Email Notification success."
    }


@app.route("/send_email", methods=['POST'])
def place_order():
    # Simple check of input format and data of the request are JSON
    if request.is_json:
        try:
            emailRequest = request.get_json()
            print("\nReceived an email notification in JSON:", emailRequest)

            # 1. Send order info {cart items}
            result = processEmailNotification(emailRequest)
            print('\n------------------------')
            print('\nresult: ', result)
            return jsonify(result), result["code"]

        except Exception as e:
            # Unexpected error in code
            exc_type, exc_obj, exc_tb = sys.exc_info()
            fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
            ex_str = str(e) + " at " + str(exc_type) + ": " + fname + ": line " + str(exc_tb.tb_lineno)
            print(ex_str)

            return jsonify({
                "code": 500,
                "message": "sender.py internal error: " + ex_str
            }), 500

    # if reached here, not a JSON request.
    return jsonify({
        "code": 400,
        "message": "Invalid JSON input: " + str(request.get_data())
    }), 400


if __name__ == "__main__":
    print("This is flask " + os.path.basename(__file__) + " for placing an order...")
    app.run(host="0.0.0.0", port=5001, debug=True)
    # Notes for the parameters: 
    # - debug=True will reload the program automatically if a change is detected;
    #   -- it in fact starts two instances of the same flask program, and uses one of the instances to monitor the program changes;
    # - host="0.0.0.0" allows the flask program to accept requests sent from any IP/host (in addition to localhost),
    #   -- i.e., it gives permissions to hosts with any IP to access the flask program,
    #   -- as long as the hosts can already reach the machine running the flask program along the network;
    #   -- it doesn't mean to use http://0.0.0.0 to access the flask program.
