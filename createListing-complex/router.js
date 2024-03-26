const express = require("express");
const router = express.Router();

//service methods//
const {
  createListing,
  getUser,
  sendEmail,
  updateUserWallet,
  createTransactionRecord,
} = require("./service");

// define the about route
router.post("/createListing", async (req, res) => {
  const postData = req.body;
  if (
    postData.listingName === undefined ||
    postData.listingDescription === undefined ||
    postData.sellerId === undefined ||
    postData.startBid === undefined ||
    postData.boosted === undefined ||
    postData.listingImg === undefined
  ) {
    // If any required attribute is missing, send a 400 Bad Request response
    return res
      .status(400)
      .json({ error: "Missing required attributes in request body" });
  }
  if (postData.boosted) {
    let deduct, result, listingId, createRecord, result2;
    const amount = 2;
    //try updating user wallet
    try {
      deduct = await updateUserWallet(postData.sellerId, amount);
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({ result: "Error updating User wallet" });
    }
    if (deduct) {
      var listing = {
        listingName: postData.listingName,
        listingDescription: postData.listingDescription,
        listingImg: postData.listingImg,
        sellerId: postData.sellerId,
        startBid: postData.startBid,
        boosted: true,
      };
      //try creating Listing
      try {
        result = await createListing(listing);
        listingId = result.key;
      } catch (error) {
        console.log(error.message);
        return res.status(400).json({ result: "Error creating Listing" });
      }
      //try creating transaction record
      try {
        createRecord = await createTransactionRecord(
          postData.sellerId,
          listingId,
          amount
        );
      } catch (error) {
        console.log(error.message);
        return res
          .status(400)
          .json({ result: "Error creating transaction record" });
      }
      //try sending email
      try {
        result2 = await getUser(postData.sellerId);
        sendEmail(result2.AuctionUsers[0].email);
      } catch (error) {
        console.log(error.message);
        return res
          .status(400)
          .json({ result: "Error getting user and sending email" });
      }

      //once all try catch done
      console.log("success! created listing with boost");
      return res.status(200).json({
        result: {
          transactionID: createRecord.transactionId,
          listing: result.message,
          user: result2.AuctionUsers,
        },
      });
    } else {
      return res.status(200).json({ result: "Not enough money to buy boost" });
    }
  } else {
    let result, result2;
    try {
      var listing = {
        listingName: postData.listingName,
        listingDescription: postData.listingDescription,
        listingImg: postData.listingImg,
        sellerId: postData.sellerId,
        startBid: postData.startBid,
        boosted: false,
      };
      result = await createListing(listing);
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({ result: "Error getting creating Listing" });
    }
    try {
      result2 = await getUser(postData.sellerId);
      sendEmail(result2.AuctionUsers[0].email);
    } catch (error) {
      console.log(error.message);
      return res
        .status(400)
        .json({ result: "Error getting user and sending email" });
    }
    console.log("success!  created listing without boost");
    return res.status(200).json({
      result: {
        listing: result.message,
        user: result2.AuctionUsers,
      },
    });
  }
});

module.exports = router;
