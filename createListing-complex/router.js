const express = require('express')
const router = express.Router()

//service methods//
const { createListing,getUser,sendEmail} = require('./service');

// define the about route
router.post('/createListing',async (req, res) => {
    const postData = req.body;
  try{
    var listing= {
      name: postData.name,
      description: postData.description,
      sellerId:postData.sellerId,
      startBid:postData.startBid
  }
    const result = await createListing(listing);
    const result2 =await getUser(postData.sellerId);
    console.log(result2.AuctionUsers[0].email,"USERRRRRR")
    sendEmail(result2.AuctionUsers[0].email)
    res.status(200).json({result:{
      result,
      result2
    }})

  }catch(error){
    console.log("error",error.message)
  }

  }
)

module.exports = router;