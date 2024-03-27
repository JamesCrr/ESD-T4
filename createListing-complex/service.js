const axios = require("axios");
const uuid = require("uuid"); // Import the uuid library
const amqp = require("amqplib");

async function createListing(listing) {
  console.log(listing);
  try {
    const response = await axios.post(
      "http://listings:9999/createListing",
      listing
    );
    return response.data;
  } catch (error) {
    console.log("Error", error.message);
  }
}

async function deleteListing(listingId) {
  try {
    const response = await axios.delete(
      `http://listings:9999/${listingId}`
    );
    return response.data;
  } catch (error) {
    console.log("Error", error.message);
  }
}

async function getUser(userId) {
  const params = {
    userId: userId,
  };
  try {
    const response = await axios.get(
      "https://personal-swk23gov.outsystemscloud.com/User_API/rest/v1/user",
      { params }
    );
    return response.data;
  } catch (error) {
    console.log("Error", error);
  }
}

async function updateUserWallet(userId, amount) {
  try {
    postData = {
      userId: userId,
      updateAmount: amount,
    };
    const response = await axios.put(
      "https://personal-swk23gov.outsystemscloud.com/User_API/rest/v1/user/wallet",
      postData
    );
    console.log(response.data.Result.success, "SUCCESS OR NAH");
    if (response.data.Result.success) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error", error);
  }
}

async function createTransactionRecord(buyerId, listingId, amount) {
  const data = {
    transactionId: uuid.v4(),
    sellerId: "companyUUID",
    buyerId: buyerId,
    amount: amount,
    listingId: listingId,
  };
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios.post(
      "http://transactionsbackend:8008/transactions/",
      data,
      config
    );
    console.log("SUCCESS!:", response.data);
    return response.data;
  } catch (error) {
    console.log("Error", error.message);
  }
}

async function deleteTransactionRecord(transactionId) {
 
  try {
    const response = await axios.delete(
      `http://transactionsbackend:8008/transactions/${transactionId}`
    );
    console.log("Deleted!:", response.data);
    return response.data;
  } catch (error) {
    console.log("Error", error.message);
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
      connection = await amqp.connect(
        `amqp://guest:guest@${queuehostName}:5672`
      );
      channel = await connection.createChannel();

      // Declare the exchange if not already declared
      await channel.assertExchange(exchangeName, "topic", { durable: true });
    } catch (err) {
      // Retry Connection
      retryCount++;
      console.error(
        `Error connecting to RabbitMQ (Attempt ${retryCount}:`,
        err.message
      );
      console.log(`Retrying in ${delayRetrySeconds} seconds...`);
      await new Promise((resolve) =>
        setTimeout(resolve, delayRetrySeconds * 1000)
      );
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
    console.log(
      `Message sent: ${JSON.stringify(
        message
      )} to ${exchangeName} with routing key of ${routingKey}`
    );
  } catch (err) {
    console.error("Error sending message:", err.message);
  }
}

async function sendEmail(emailtarget) {
  let message = {
    emailType: "listingCreated",
    emailTarget: "jonathanlee3800@gmail.com",
    emailTitle: "Listing Created!",
    emailContent: "<p>Your Listing has been Created!</p>",
    senderUserObject: {
      username: "Pepe the frog",
    },
  };
  sendMessageToQueue(
    channel,
    "email.listing",
    Buffer.from(JSON.stringify(message))
  );
}
module.exports = {
  createListing,
  deleteListing,
  getUser,
  sendEmail,
  updateUserWallet,
  createTransactionRecord,
  deleteTransactionRecord
};
