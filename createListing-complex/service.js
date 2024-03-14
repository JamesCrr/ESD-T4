const axios = require('axios');
const uuid = require('uuid'); // Import the uuid library
const amqp = require("amqplib");


async function createListing(listing){
    try{
        const response= await axios.post('http://localhost:3001/createListing', listing)
        return response.data;
    }catch(error){
        console.log("Error",error)
    }
}

async function getUser(userId){
    const params = {
        userId: userId,
      };
    try{
        const response= await axios.get('https://personal-swk23gov.outsystemscloud.com/User_API/rest/v1/user', {params})
        return response.data;
    }catch(error){
        console.log("Error",error)
    }
}

// Connect to RabbitMQ
const queuehostName = "notification-rabbitmq";
const exchangeName = "email_topic";
let connection = undefined;
let channel = undefined;
(async () => {
  let retryCount = 0;
  const delayRetrySeconds = 2;
  async function tryConnect() {
    try {
      connection = await amqp.connect(`amqp://guest:guest@${queuehostName}:5672`);
      channel = await connection.createChannel();

      // Declare the exchange if not already declared
      await channel.assertExchange(exchangeName, "topic", { durable: true });
    } catch (err) {
      // Retry Connection
      retryCount++;
      console.error(`Error connecting to RabbitMQ (Attempt ${retryCount}:`, err.message);
      console.log(`Retrying in ${delayRetrySeconds} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, delayRetrySeconds * 1000));
    }
  }

  while (connection == undefined && channel == undefined) {
    // Recursive retry
    await tryConnect();
  }
  // Start Web Server
  console.log("Connected to RabbitMQ successfully!");

  // Close the connection when done
  // await connection.close();
})();
//send message to amqp
async function sendMessageToQueue(channel, routingKey, message) {
    try {
      // Publish the message to the exchange with the specified routing key
      await channel.publish(exchangeName, routingKey, message);
      console.log(`Message sent: ${JSON.stringify(message)} to ${exchangeName} with routing key of ${routingKey}`);
    } catch (err) {
      console.error("Error sending message:", err.message);
    }
  }

async function sendEmail(emailtarget){
    let message = {
        emailType: "listingCreated",
        emailTarget: "jonathanlee54211@gmail.com",
        emailTitle: "Listing Created!",
        emailContent: "<p>Your Listing has been Created!</p>",
        senderUserObject: {
          username: "Pepe the frog",
        },
      };
    sendMessageToQueue(channel, "email.listing", Buffer.from(JSON.stringify(message)));
}
module.exports = { createListing,getUser,sendEmail };
