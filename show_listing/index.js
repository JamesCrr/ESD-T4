const express = require("express");
const app = express();
const axios = require("axios");
const port = 3013;

const listingEndpoint = "http://host.docker.internal:3001/getAllListings";
const userEndpoint =
  "https://personal-swk23gov.outsystemscloud.com/User_API/rest/v1/user?userId=";

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

app.get("/getAllOpenListing", async (req, res) => {
  try {
    const fetchAllListing = await axios.get(listingEndpoint);
    const listings = fetchAllListing.data;
    if (listings.length === 0) {
      res.status(404).send("No listings found");
    }
    const filterOpenListing = listings.filter((listing) => listing.status);
    if (filterOpenListing.length === 0) {
      res.status(404).send("No listings found");
    }

    const uniqueMap = {};

    // Populate uniqueMap with listings
    filterOpenListing.forEach((listing) => {
      const bidder = listing["sellerId"];
      if (uniqueMap[bidder]) {
        uniqueMap[bidder].push(listing);
      } else {
        uniqueMap[bidder] = [listing];
      }
    });

    // Fetch user details for each username
    const retrieveUsernames = await Promise.all(
      Object.keys(uniqueMap).map(async (username) => {
        let response = await axios.get(`${userEndpoint}${username}`);
        const user = response.data;

        if (!user) {
          return null;
        }

        const newUsername = user["AuctionUsers"][0]["username"];
        uniqueMap[newUsername] = uniqueMap[username];
        delete uniqueMap[username];

        return newUsername;
      })
    );

    res.json(uniqueMap);
  } catch (e) {
    console.error(e);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
