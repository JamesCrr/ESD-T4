const express = require("express");
const router = express.Router();

//service methods//
const {
  updateUserWallet,
  createTransactionRecord,
  getUser,
  buyboost,
} = require("./service");

// define the home page route
router.post("/closeAuctionPost", async (req, res) => {
  const postData = req.body;
  if (
    postData.listingId === undefined ||
    postData.sellerId === undefined ||
    postData.buyerId === undefined ||
    postData.highestBid === undefined
  ) {
    // For example, you can send a 400 Bad Request response
    console.log("Missing required attributes in request body")
    return res
      .status(400)
      .json({ error: "Missing required attributes in request body" });
  }
  let result, result2;

  //try updating user wallet

  try {
    result = await updateUserWallet(postData.sellerId, postData.highestBid);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Error updating wallet" });
  }
  if (!result.Result.success) {
    console.log("Not ")
    return res.status(400).json({
      Result: {
        success: false,
        message: "Error adding money into account",
      },
    });
  } else {

    //try to create tranasction record
    try {
      result2 = await createTransactionRecord(
        postData.buyerId,
        postData.sellerId,
        postData.listingId,
        postData.highestBid
      );
    } catch (error) {
      console.log(error.message);
      try{
        await updateUserWallet(postData.sellerId, -postData.highestBid);
        console.log("seller wallet reversed")
      }catch(error){
        console.log(error.message)
        return res
        .status(400)
        .json({ result: "Error reversing from creating transaction record" });
    }
      return res
        .status(500)
        .json({ error: "Error updating transaction record wallet" });
    }
    
    //finally
    console.log("Success: Wallet updated and transaction record created!");
    return res.status(200).json({
      Result: {
        updateWallet: result.Result.message,
        transactionRecord: result2.transactionId,
      },
    });
  }
});

module.exports = router;
