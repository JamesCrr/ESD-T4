const express = require("express");
const router = express.Router();

//service methods//
const {
  createListing,
  getUser,
  sendEmail,
  updateUserWallet,
  createTransactionRecord,
  deleteListing,
  deleteTransactionRecord,
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
  //if boosted is true
  if (postData.boosted) {
    let deduct, result, listingId, createRecord, result2;
    const amount = 2;
    //try updating user wallet
    try {
      deduct = await updateUserWallet(postData.sellerId, -amount);
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
        try {
          await updateUserWallet(postData.sellerId, amount);
          console.log("wallet reversed")
        } catch (error2) {
          console.log(error2.message);
          return res
            .status(400)
            .json({ result: "Error reversing from create listing" });
        }
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
        try {
          await updateUserWallet(postData.sellerId, amount);
          await deleteListing(listingId);
          console.log("wallet,listing reversed")

        } catch (error2) {
          console.log(error2.message);
          return res
            .status(400)
            .json({ result: "Error reversing from create transaction record" });
        }
        return res
          .status(400)
          .json({ result: "Error creating transaction record" });
      }
      //try sending email
      try {
        result2 = await getUser(postData.sellerId);
        sendEmail(result2.AuctionUsers[0].email);
      } catch (error) {
        try {
          await updateUserWallet(postData.sellerId, amount);
          await deleteListing(listingId);
          await deleteTransactionRecord(createRecord.transactionId);
          console.log("wallet,listing,transaction record reversed")
        } catch (error2) {
          console.log(error2.message);
          return res
            .status(400)
            .json({ result: "Error reversing from send email" });
        }

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
    //if boosted is false
  } else {
    let result, result2, listingId;
    //try create listing
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
      listingId = result.key;
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({ result: "Error getting creating Listing" });
    }
    //try sending email
    try {
      result2 = await getUser(postData.sellerId);
      sendEmail(result2.AuctionUsers[0].email);
    } catch (error) {
      console.log(error.message);
      try {
        await deleteListing(listingId);
        console.log("listing reversed")

      } catch (error2) {
        console.log(error2.message);
        return res
          .status(400)
          .json({ result: "Error reversing from create create listing" });
      }
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
