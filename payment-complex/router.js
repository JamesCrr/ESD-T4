const express = require('express')
const router = express.Router()


//service methods//
const { updateUserWallet,createTransactionRecord} = require('./service');

// define the home page route
router.post('/closeAuctionPost', async (req, res) => {
    const postData = req.body;
    try {
        const result = await updateUserWallet(postData.sellerId, postData.amount);
        const result2= await createTransactionRecord(postData.buyerId,postData.sellerId,postData.listingId, postData.amount);
        res.json({
            updateWallet:result,
            "createTransactionRecord SUCCESS":result2
        });
    } catch (error) {
        res.status(500).json({ error: "Error creating transaction record" });
    }
    
})
// define the about route
router.get('/about', (req, res) => {
  res.send('This route is for the transaction-backend microservice')
})


router.post('/lol', async (req, res) => {
    const postData = req.body;
    try {
        const result2= await createTransactionRecord(postData.buyerId,postData.sellerId,postData.listingId, postData.amount);
        res.send(
           result2
        );
    } catch (error) {
        res.status(500).json({ error: "Error creating transaction record" });
    }
  })

module.exports = router