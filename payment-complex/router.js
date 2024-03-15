const express = require('express')
const router = express.Router()


//service methods//
const { updateUserWallet,createTransactionRecord, getUser, buyboost} = require('./service');

// define the home page route
router.post('/closeAuctionPost', async (req, res) => {
    const postData = req.body;
    try {
        const result = await updateUserWallet(postData.sellerId, postData.amount);
        console.log(result.Result.success)
        if(!result.Result.success){
            res.json({
                updateWallet:{
                    success:false,
                    message:"User not enough money in wallet!"
                } 
               
            })
        }else{
            console.log("Creating update record")
            const result2= await createTransactionRecord(postData.buyerId,postData.sellerId,postData.listingId, postData.amount);
            res.json({
                updateWallet:result,
                "createTransactionRecord SUCCESS":result2
            });
        }
      
    } catch (error) {
        res.status(500).json({ error: "Error creating transaction record" });
    }
    
})

router.post('/boostListingPost', async (req, res) => {
    const postData = req.body;
    try {
        const walletamt = await getUser(postData.userId);
        const result= await buyboost(postData.userId,walletamt,postData.amount);
        if(!result.success){
            res.json({
                result:{
                    success:result.success,
                    message:result.message
                },
            })
        }else{
            res.json({
                result:{
                    success:result.success,
                    updatedUser:result.result.UpdatedAuctionUser
    
                },
            });
        }
       
    } catch (error) {
        res.status(500).json({ error: "Error with boosting api" });
    }
    
})

// define the about route
router.get('/about', (req, res) => {
  res.send('This route is for the transaction-backend microservice')
})

module.exports = router