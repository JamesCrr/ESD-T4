const express = require('express')
const router = express.Router()

//service methods//
const { createListing,getUser,sendEmail} = require('./service');

// define the about route
router.post('/createListing',async (req, res) => {
    const postData = req.body;
  try{
    var listing={
        auctionEndDateTime: null,
        boosted: postData.boosted,
        description: postData.description,
        highestBid: 0,
        highestBidder: null,
        imageUrl: null,
        name: postData.name,
        sellerId: postData.sellerId,
        startBid: postData.sellerBid,
        status: false,
        transactionEndDateTime: null,
        transactionStatus: false
      }
    // const result = await createListing(listing);
    const result2 =await getUser(postData.sellerId);
    console.log(result2.AuctionUsers[0].email,"USERRRRRR")
    sendEmail(result2.AuctionUsers[0].email)
    res.status(200).json({'data':result2})

  }catch(error){
    console.log("error",error.message)
  }

  }
)

module.exports = router;