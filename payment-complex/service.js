const axios = require('axios');
const uuid = require('uuid'); // Import the uuid library

async function getUser(userId){
    const params = {
        userId: userId,
      }
    try{
        const response= await axios.get('https://personal-swk23gov.outsystemscloud.com/User_API/rest/v1/user/', {params})
        return response.data.AuctionUsers[0].wallet;
    }catch(error){
        console.log("Error",error)
    }
}
async function updateUserWallet(userId,amount){
    try{
        const walletamt= await getUser(userId);
        console.log(walletamt,"WALLET AMT")
        postData={
            user_id:userId,
            wallet:walletamt+amount
        }
        const response= await axios.put('https://personal-swk23gov.outsystemscloud.com/User_API/rest/v1/user/wallet', postData)
        return response.data;
    }catch(error){
        console.log("Error",error)
    }
}
async function createTransactionRecord(buyerId,sellerId,listingId,amount){
    const data = {
        transactionId: uuid.v4(),
        sellerId: sellerId,
        buyerId: buyerId,
        amount: amount,
        listingId: listingId
    }
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    try{
        const response= await axios.post('http://127.0.0.1:8000/transactions/', data,config)
        console.log('SUCCESS!:', response.data);
        return response.data;
        
    }catch(error){
        console.log("Error",error)
    }
}


module.exports = { updateUserWallet,createTransactionRecord };
