import amqp_connection
import json
import pika
from dotenv import load_dotenv
from mailjet_rest import Client
from os import environ
load_dotenv()  # take environment variables from .env.
import emailservice

# Instead of hardcoding the values, we can also get them from the environ as shown below
# queueName = environ.get('EmailsQueue') #EmailsQueue
hostName = "notification-rabbitmq"
exchangeName = "email_topic"
exchangeType = "topic"
queueName = 'EmailsQueue' # queue to be subscribed by emailer microservice

# Get Mailjet keys
API_KEY = environ.get("MJ_APIKEY_PUBLIC")
API_SECRET = environ.get("MJ_APIKEY_PRIVATE")

def startListeningForMessages(channel):
    try:
        if not amqp_connection.check_exchange(channel, exchangeName, exchangeType):
            print(f"{queueName} is not defined! Consumer not initialized!")
            return    

        # set up a consumer and start to wait for coming messages
        channel.basic_consume(queue=queueName, on_message_callback=messageCallback, auto_ack=True)
        print(queueName+": Consuming from queue:", queueName)
        channel.start_consuming()  # an implicit loop waiting to receive messages;
        # it doesn't exit by default. Use Ctrl+C in the command window to terminate it.
    
    except pika.exceptions.AMQPError as e:
        print(f"{queueName}: Failed to connect: {e}") # might encounter error if the exchange or the queue is not created

    except KeyboardInterrupt:
        print(queueName+": Program interrupted by user.")

def messageCallback(channel, method, properties, body): # required signature for the callback; no return
    print(f"\n{queueName}: Received an log by " + __file__)

    messageJSON = json.loads(body)
    print(f"{queueName}: Recording an JSON log:")
    print(messageJSON)

    emailType = messageJSON["emailType"] if "emailType" in messageJSON else ""
    emailTarget = messageJSON["emailTarget"] if "emailTarget" in messageJSON else "esdt42024@gmail.com"
    emailTitle = messageJSON["emailTitle"] if "emailTitle" in messageJSON else ""
    emailContent = messageJSON["emailContent"] if "emailContent" in messageJSON else ""
    senderUserObject = messageJSON["senderUserObject"] if "senderUserObject" in messageJSON else None
    if senderUserObject == None:
        print(f"{queueName}: Message not processed! senderUserObject is None!")
        return

    # Send the email
    # if emailType == "listingCreated":
    emailservice.sendEmail(emailTarget, senderUserObject["username"], emailTitle, emailContent)

    # # Manually acknowledge the message
    # channel.basic_ack(delivery_tag=method.delivery_tag)


if __name__ == "__main__":  # execute this program only if it is run as a script (not by 'import')
    print(f"{queueName}: Getting Connection")
    connection = amqp_connection.create_connection(hostName) # get the connection to the broker
    # connection = amqp_connection.create_connection("localhost") # get the connection to the broker
    print("EmailsQueue: Connection established successfully")
    
    channel = connection.channel()
    startListeningForMessages(channel)

