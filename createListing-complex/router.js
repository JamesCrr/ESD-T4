const express = require('express')
const router = express.Router()

//service methods//
const { createListing,getUser,sendEmail,updateUserWallet,createTransactionRecord} = require('./service');

// define the about route
router.post('/createListing',async (req, res) => {
  const postData = req.body;
  if (postData.listingName===undefined || postData.listingDescription===undefined || postData.sellerId===undefined || postData.startBid===undefined || postData.boosted === undefined || postData.listingImg === undefined) {
    // If any required attribute is missing, send a 400 Bad Request response
    return res.status(400).json({ error: 'Missing required attributes in body' });
  }
  if(postData.boosted){
    try{
      const amount=2
      const deduct =await updateUserWallet(postData.sellerId,amount)
      if(deduct){
        var listing= {
          listingName: postData.listingName,
          listingDescription: postData.listingDescription,
          listingImg:postData.listingImg,
          sellerId:postData.sellerId,
          startBid:postData.startBid,
          boosted:true
      }
        const result = await createListing(listing);
        console.log(result,"CREATE LISTING")
        var listingId = result.key
        const createRecord = await createTransactionRecord(postData.sellerId,listingId,amount)
        const result2 =await getUser(postData.sellerId);
        sendEmail(result2.AuctionUsers[0].email)
       return res.status(200).json({result:{
          transactionID:createRecord.transactionId,
          listing:result.message,
          user:result2.AuctionUsers
        }})
      }else{
       return res.status(200).json({result:"Not enough money to buy boost"})
      }
    }catch(error){
      console.log("error",error.message)
    }
  }else{
    try{
      var listing= {
        listingName: postData.listingName,
        listingDescription: postData.listingDescription,
        listingImg:postData.listingImg,
        sellerId:postData.sellerId,
        startBid:postData.startBid,
        boosted:false
    }
    const result = await createListing(listing);
    console.log(result,"CREATE LISTING")
    const result2 =await getUser(postData.sellerId);
    sendEmail(result2.AuctionUsers[0].email)
    return res.status(200).json({result:{
      listing:result.message,
      user:result2.AuctionUsers
    }})
    }catch(error){
      console.log("error",error.message)
    }
  }
  }
)

module.exports = router;