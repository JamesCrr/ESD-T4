from dotenv import load_dotenv
from mailjet_rest import Client
import os
import copy

load_dotenv()  # take environment variables from .env.

# Get your environment Mailjet keys
API_KEY = os.environ.get("MJ_APIKEY_PUBLIC")
API_SECRET = os.environ.get("MJ_APIKEY_PRIVATE")

mailjet = Client(auth=(API_KEY, API_SECRET), version='v3.1')

dataTemplate = {
  'Messages': [
    {
      "From": {
        "Email": "esdt42024@gmail.com",
        "Name": "ESDTeam4"
      },
      "To": [
        {
          "Email": "CUSTOMER EMAIL",
          "Name": "CUSTOMER"
        }
      ],
      "Subject": "My first Mailjet Email!",
      "TextPart": "Greetings from Mailjet!",
      "HTMLPart": "<h3>Dear passenger 1, welcome to <a href=\"https://www.mailjet.com/\">Mailjet</a>!</h3><br />May the delivery force be with you!"
    }
  ]
}

def sendEmail(targetEmail, username):
  # Create new data to send over
  newData = copy.deepcopy(dataTemplate)
  newData["Messages"][0]["To"][0]["Email"] = targetEmail
  newData["Messages"][0]["To"][0]["Name"] = username
  newData["Messages"][0]["Subject"] = "Bid Confirmed!"
  newData["Messages"][0]["HTMLPart"] = f"""
  <div>
    <h3>Dear {username}, welcome to <a href=\"https://www.mailjet.com/\">Mailjet</a>!</h3>
    <br />
    <div>
        <img src="https://img.wattpad.com/cover/106286575-288-k371082.jpg" alt="" width="200" height="300" style="display: block; margin: auto;"> 
    </div>

    <p>Your order has been heard!</p>
  </div>
  """

  # Send the email 
  result = mailjet.send.create(data=newData)
  print(result.status_code)
  print(result.json())