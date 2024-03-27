const swaggerDocs = require("./swagger.js");
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const amqp = require("amqplib");

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API Endpoints
const userEndpointURL = "https://personal-swk23gov.outsystemscloud.com/User_API/rest/v1/user";
const listingPortNum = process.env.LISTING_SIMPLE_PORT_NUM || 9999;
// const listingEndpointURL = "http://listings:" + listingPortNum;
const listingEndpointURL = "http://kong:8000/listing";
const bidPortNum = process.env.BID_SIMPLE_PORT_NUM || 3012;
// const bidEndpointURL = "http://bid_microservice:" + bidPortNum;
const bidEndpointURL = "http://kong:8000/bid";

// Kong API Key
const KONG_ADMIN_APIKEY = process.env.KONG_ADMIN_APIKEY;

// Connect to RabbitMQ
const queuehostName = "notification-rabbitmq";
const exchangeName = "email_topic";
let connection = undefined;
let channel = undefined;
/**
 * Helper function to connect to RabbitMQ
 */
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
  const port = 3000;
  app.listen(port, function () {
    console.log("Web server listening on port " + port);
  });
  swaggerDocs(app, port);

  // Close the connection when done
  // await connection.close();
})();

/**
 * Helper function to send Message to Channel based on routing key
 * @param {Object} channel
 * @param {String} routingKey
 * @param {String} message
 */
async function sendMessageToQueue(channel, routingKey, message) {
  const options = { persistent: true };
  try {
    // Publish the message to the exchange with the specified routing key
    await channel.publish(exchangeName, routingKey, message, options);
    console.log(`Message sent: ${JSON.stringify(message)} to ${exchangeName} with routing key of ${routingKey}`);
  } catch (err) {
    console.error("Error sending message:", err.message);
  }
}

/**
 * Helper function to log any Axios Erros to the console
 * @param {Object} error
 * @param {String} customConsoleMessage
 */
const printAxiosError = (error, customConsoleMessage) => {
  console.log(customConsoleMessage);
  if (error.response) {
    // The request was made and the server responded with a status code that falls out of the range of 2xx
    console.log("Server responded with an error status:", error.response.status);
    console.log("Error data:", error.response.data);
  } else if (error.request) {
    // The request was made but no response was received
    console.log("No response received from the server");
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log("Error setting up the request:", error.message);
  }
};

/** POST Methods */
/**
 * @openapi
 * '/':
 *  post:
 *     summary: Complex Microservice Bid for a Listing
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - userId
 *              - listingId
 *              - bidPrice
 *            properties:
 *              userId:
 *                type: string
 *              listingId:
 *                type: string
 *              bidPrice:
 *                type: integer
 *     responses:
 *      201:
 *        description: Created
 *      500:
 *        description: Server Error
 */
app.post("/", async function (req, res, next) {
  const incomingBidInfo = req.body;

  if (
    incomingBidInfo === undefined ||
    incomingBidInfo.bidPrice === undefined ||
    Number(incomingBidInfo?.bidPrice) === NaN
  ) {
    console.log("FAILED!! bidPrice is not a number!");
    res.status(500).json({ errorMessage: "FAILED!! bidPrice is not a number!" });
    return;
  }

  // PUT: Update user wallet
  console.log("PUT: Update user wallet");
  let walletData = {
    userId: incomingBidInfo.userId,
    updateAmount: -incomingBidInfo.bidPrice,
  };
  try {
    const response = await axios.put(userEndpointURL + "/wallet", walletData);
    // console.log("External API response:", response.data);
    updatedAuctionUser = response.data.UpdatedAuctionUser;
  } catch (error) {
    printAxiosError(error, "FAILED!! Update user wallet");
    res
      .status(500)
      .json({ errorMessage: error.message, errorResponseData: error.response?.data ? error.response.data : undefined });
    return;
  }

  // GET: Get Listing highest bid
  console.log("GET: Get Listing highest bid");
  let listingData = {};
  try {
    const response = await axios.get(listingEndpointURL + "/getListing/" + incomingBidInfo.listingId, {
      headers: { apikey: KONG_ADMIN_APIKEY },
    });

    // console.log("Listing:", response.data);
    listingData = response.data;
  } catch (error) {
    printAxiosError(error, "FAILED!! Get Listing highest bid");
    // Undo deduct from user Wallet
    walletData = {
      userId: incomingBidInfo.userId,
      updateAmount: incomingBidInfo.bidPrice,
    };
    await axios.put(userEndpointURL + "/wallet", walletData);

    res
      .status(500)
      .json({ errorMessage: error.message, errorResponseData: error.response?.data ? error.response.data : undefined });
    return;
  }

  // PUT: Refund the previous highest bidder
  console.log("PUT: Refund the previous highest bidder");
  if (listingData.highestBidder !== "") {
    walletData = {
      userId: listingData.highestBidder,
      updateAmount: listingData.highestBid,
    };
    try {
      const response = await axios.put(userEndpointURL + "/wallet", walletData);
    } catch (error) {
      printAxiosError(error, "FAILED!! Refund the previous highest bidder");
      // Undo deduct from user Wallet
      walletData = {
        userId: incomingBidInfo.userId,
        updateAmount: incomingBidInfo.bidPrice,
      };
      await axios.put(userEndpointURL + "/wallet", walletData);

      res.status(500).json({
        errorMessage: error.message,
        errorResponseData: error.response?.data ? error.response.data : undefined,
      });
      return;
    }
  }

  // PUT: Update Listing with new highest userId and bid price
  console.log("PUT: Update Listing with new highest userId and bid price");
  const newListingData = { ...listingData };
  newListingData.highestBid = Number(incomingBidInfo.bidPrice);
  newListingData.highestBidder = incomingBidInfo.userId;
  try {
    const response = await axios.put(
      listingEndpointURL + "/updateListing/" + newListingData.listingId,
      newListingData,
      { headers: { apikey: KONG_ADMIN_APIKEY } }
    );
    // console.log("Listing:", response.data);
  } catch (error) {
    printAxiosError(error, "FAILED!! Send new Bid details into Bidding DB");
    // Undo deduct from user Wallet
    walletData = {
      userId: incomingBidInfo.userId,
      updateAmount: incomingBidInfo.bidPrice,
    };
    await axios.put(userEndpointURL + "/wallet", walletData);
    // Undo refund previous highest bidder
    if (listingData.highestBidder !== "") {
      walletData = {
        userId: listingData.highestBidder,
        updateAmount: -listingData.highestBid,
      };
      await axios.put(userEndpointURL + "/wallet", walletData);
    }

    res
      .status(500)
      .json({ errorMessage: error.message, errorResponseData: error.response?.data ? error.response.data : undefined });
    return;
  }

  // POST: Send new Bid details into Bidding DB
  console.log("POST: Send new Bid details into Bidding DB");
  let newBidDataObject = {
    bidAmt: incomingBidInfo.bidPrice,
    listingId: listingData.listingId,
    userId: incomingBidInfo.userId,
  };
  // console.log("newBidDataObject:", newBidDataObject);
  try {
    const response = await axios.post(bidEndpointURL + "/create", newBidDataObject, {
      headers: { apikey: KONG_ADMIN_APIKEY },
    });
    // console.log("Bid:", response.data);
  } catch (error) {
    printAxiosError(error, "FAILED!! Send new Bid details into Bidding DB");
    // Undo deduct from user Wallet
    walletData = {
      userId: incomingBidInfo.userId,
      updateAmount: incomingBidInfo.bidPrice,
    };
    await axios.put(userEndpointURL + "/wallet", walletData);
    // Undo refund previous highest bidder
    if (listingData.highestBidder !== "") {
      walletData = {
        userId: listingData.highestBidder,
        updateAmount: -listingData.highestBid,
      };
      await axios.put(userEndpointURL + "/wallet", walletData);
    }
    // Undo update listing with new highest userId and bid price
    await axios.put(listingEndpointURL + "/updateListing/" + listingData.listingId, listingData);

    res
      .status(500)
      .json({ errorMessage: error.message, errorResponseData: error.response?.data ? error.response.data : undefined });
    return;
  }

  // AMQP: Send email that bid was confirmed
  let message = {
    emailType: "listingCreated",
    emailTarget: "esdt42024@gmail.com",
    emailTitle: "Listing Created!",
    emailContent: "<p>Your Listing has been Created!</p>",
    senderUserObject: {
      username: "Pepe the frog",
    },
  };
  sendMessageToQueue(channel, "email.listing", Buffer.from(JSON.stringify(message)));

  // AMQP: Notify previous bidder that he was outbidded
  message = {
    emailType: "outBidded",
    emailTarget: "esdt42024@gmail.com",
    emailTitle: "You have been Outbidded!",
    emailContent: "<p>Your Bid has been OutBidded!</p>",
    senderUserObject: {
      username: "Pepe the frog",
    },
  };
  sendMessageToQueue(channel, "email.outbidded", Buffer.from(JSON.stringify(message)));

  res.json({ message: "success!" });
});
