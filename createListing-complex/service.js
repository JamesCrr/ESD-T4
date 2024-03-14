const axios = require('axios');
const uuid = require('uuid'); // Import the uuid library


async function createListing(listing){
    try{
        const response= await axios.post('http://localhost:3001/createListing', listing)
        return response.data;
    }catch(error){
        console.log("Error",error)
    }
}

async function getUser(userId){
    const params = {
        userId: userId,
      };
    try{
        const response= await axios.get('https://personal-swk23gov.outsystemscloud.com/User_API/rest/v1/user', {params})
        return response.data;
    }catch(error){
        console.log("Error",error)
    }
}
module.exports = { createListing,getUser };
