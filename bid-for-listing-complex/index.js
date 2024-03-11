const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API Endpoints
const userEndpointURL = "https://personal-swk23gov.outsystemscloud.com/User_API/rest/v1/user";
const listingPortNum = process.env.LISTING_SIMPLE_PORT_NUM || 3001;
const listingEndpointURL = "http://listings:" + listingPortNum;
const bidPortNum = process.env.BID_SIMPLE_PORT_NUM || 3012;
const bidEndpointURL = "http://bid_microservice:" + bidPortNum;

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

// Bid for Listing
app.post("/", async function (req, res, next) {
  const incomingBidInfo = req.body;

  // PUT: Update user wallet
  console.log("PUT: Update user wallet");
  let updatedAuctionUser = {};
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
    res.status(500).json({ error: error.response?.data ? error.response.data : error.message });
    return;
  }

  // GET: Get Listing highest bid
  console.log("GET: Get Listing highest bid");
  let listingData = {};
  try {
    /**
     * HAARD CODING THE LISTING ID HERE TO 1
     */
    // const response = await axios.get(listingEndpointURL + "/getListing/" + incomingBidInfo.listingId);
    const response = await axios.get(listingEndpointURL + "/getListing/" + 1);
    // console.log("Listing:", response.data);
    listingData = response.data;
  } catch (error) {
    printAxiosError(error, "FAILED!! Get Listing highest bid");
    res.status(500).json({ error: error.message });
    return;
  }

  // PUT: Refund the previous highest bidder
  console.log("PUT: Refund the previous highest bidder");
  walletData = {
    userId: listingData.highestBidder,
    updateAmount: listingData.highestBid,
  };
  try {
    const response = await axios.put(userEndpointURL + "/wallet", walletData);
  } catch (error) {
    printAxiosError(error, "FAILED!! Refund the previous highest bidder");
    res.status(500).json({ error: error.response?.data ? error.response.data : error.message });
    return;
  }

  // PUT: Update Listing with new highest userId and bid price
  console.log("PUT: Update Listing with new highest userId and bid price");
  listingData.highestBid = incomingBidInfo.bidPrice;
  listingData.highestBidder = incomingBidInfo.userId;
  try {
    const response = await axios.put(listingEndpointURL + "/updateListing/" + listingData.id, listingData);
    // console.log("Listing:", response.data);
  } catch (error) {
    printAxiosError(error, "FAILED!! Send new Bid details into Bidding DB");
    res.status(500).json({ error: error.message });
    return;
  }

  // POST: Send new Bid details into Bidding DB
  console.log("POST: Send new Bid details into Bidding DB");
  let newBidDataObject = {
    bidAmt: incomingBidInfo.bidPrice,
    listingId: listingData.id,
    userId: incomingBidInfo.userId,
  };
  try {
    const response = await axios.post(bidEndpointURL + "/create", newBidDataObject);
    // console.log("Listing:", response.data);
  } catch (error) {
    printAxiosError(error, "FAILED!! Send new Bid details into Bidding DB");
    res.status(500).json({ error: error.message });
    return;
  }

  // AMQP: Send email that bid was confirmed
  // AMQP: Notify previous bidder that he was outbidded

  res.json({ message: "success!" });
});

const port = 3000;
app.listen(port, function () {
  console.log("Web server listening on port " + port);
});
