const express = require('express');
const bodyParser = require('body-parser');
const firebaseAdmin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');
var cors = require('cors')


// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKeyListings.json');
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: 'https://esd-listings-default-rtdb.asia-southeast1.firebasedatabase.app'
});

const db = firebaseAdmin.database();
const app = express();
const port = 9999;
app.use(cors())

//Add listing with new key based on existing data
function addListing(listing) {
  try{
  // return db.ref('listings').once('value')
  //   .then(snapshot => {
  //     const listings = snapshot.val();
  //     let lastListingId = 0;

      //Check for existing listings
      // if (listings) {
      //   const listingIds = Object.keys(listings);
      //   lastListingId = Math.max(...listingIds);
      // }
      
      // const newListingKey = ++lastListingId;
      const dateTimeCreated = new Date(Date.now())
      
      // Default values
      listing.dateTimeCreated = dateTimeCreated.toISOString();
      listing.buyerId = "";
      listing.autionEndDateTime = "";
      listing.transactionEndDateTime = "";
      listing.highestBid = 0;
      listing.highestBidder = "";
      listing.status = true;
      listing.boosted = false;
      listing.transactionStatus = false;

      const newListingKey = uuidv4();

      return db.ref(`listings/${newListingKey}`).set(listing)
        .then(() => {
          console.log('Listing added successfully with key:', newListingKey);
          return newListingKey; // Return the new listing key
        });
    }
    catch(error) {
      console.error('Error adding item:', error);
      throw error;
    };
}

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// GET Retrieve specific listing based on id
app.get('/getListing/:listingId', (req, res) => {
  const listingId = req.params.listingId;
  db.ref(`listings/${listingId}`).once('value')
    .then(snapshot => {
      const item = snapshot.val();
      if (item === null) {
        res.status(404).json({ error: 'Listing not found' });
      } else {
        res.json(item);
      }
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
});

// GET listings based on Seller ID
app.get('/getListingsBySeller/:sellerId', (req, res) => {
  const sellerId = req.params.sellerId;
  db.ref('listings')
    .orderByChild('sellerId')
    .equalTo(sellerId) // Filter listings by sellerId
    .once('value')
    .then(snapshot => {
      const listings = snapshot.val();
      if (!listings || Object.keys(listings).length === 0) {
        res.status(404).json({ error: 'No listings found for the specified seller' });
      } else {
        const listingsArray = Object.values(listings);
        res.json(listingsArray);
      }
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
});

// GET listings based on Buyer ID
app.get('/getListingsBySeller/:buyerId', (req, res) => {
  const buyerId = req.params.buyerId;
  db.ref('listings')
    .orderByChild('buyerId')
    .equalTo(buyerId) // Filter listings by buyerId
    .once('value')
    .then(snapshot => {
      const listings = snapshot.val();
      if (!listings || Object.keys(listings).length === 0) {
        res.status(404).json({ error: 'No listings found for the specified seller' });
      } else {
        const listingsArray = Object.values(listings);
        res.json(listingsArray);
      }
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
});

// GET all listings
app.get('/getAllListings', (req, res) => {
  db.ref('listings').once('value')
    .then(snapshot => {
      const listings = snapshot.val();
      if (!listings || Object.keys(listings).length === 0) {
        res.status(404).json({ error: 'No listings found' });
      } else {
        const listingsArray = Object.values(listings);
        res.json(listingsArray);
      }
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
});


// POST Create listing
app.post('/createListing', (req, res) => {
  const allowedParams = ['name', 'description', 'sellerId', 'startBid'];
  const newListing = req.body;
  
  // Check if ALL required parameters present in request body
  const isValid = allowedParams.every(param => Object.prototype.hasOwnProperty.call(newListing, param));

  if (!isValid) {
    return res.status(400).json({ error: 'Missing or invalid parameters in the request body' });
  }

  addListing(newListing)
    .then((newListingKey) => {
      res.status(201).json({ message: 'Listing created successfully', key: newListingKey });
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
});

// PUT Update listing, partial update
app.put('/updateListing/:listingId', (req, res) => {
  const listingId = req.params.listingId;
  const allowedParams = ['name', 'description', 'buyerId','highestBid', 'highestBidder', 'status', 'transactionEndDateTime', 
                        'autionEndDateTime', 'status', 'transactionStatus', 'boosted'];
  const updatedListing = req.body;

  // Check if all parameters in the request body are allowed
  const isValid = Object.keys(updatedListing).every(param => allowedParams.includes(param));
  
  if (!isValid) {
    return res.status(400).json({ error: 'Invalid parameters in the request body' });
  }

  db.ref(`listings/${listingId}`).update(updatedListing)
    .then(() => {
      res.json({ message: 'Listing updated successfully' });
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
});

// DELETE listing
app.delete('/deleteListing/:listingId', (req, res) => {
  const listingId = req.params.listingId;
  
  // Check if the listing exists
  db.ref(`listings/${listingId}`).once('value')
    .then(snapshot => {
      if (!snapshot.exists()) {
        return res.status(404).json({ error: 'Listing not found' });
      }
      return db.ref(`listings/${listingId}`).remove()
        .then(() => {
          res.json({ message: 'Listing deleted successfully' });
        });
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});