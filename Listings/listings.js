const express = require('express');
const bodyParser = require('body-parser');
const firebaseAdmin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKeyListings.json');
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: 'https://esd-listings-default-rtdb.asia-southeast1.firebasedatabase.app'
});

const db = firebaseAdmin.database();
const app = express();
const port = 3001;

//Add listing with new key based on existing data
function addItemWithCounter(listing) {
  return db.ref('listings').once('value')
    .then(snapshot => {
      const listings = snapshot.val();
      let lastListingId = 0;

      //Check for existing listings
      if (listings) {
        const listingIds = Object.keys(listings);
        lastListingId = Math.max(...listingIds);
      }
      const newListingKey = ++lastListingId;
      const dateTimeCreated = new Date(Date.now())
      
      // Add newListingKey and dateTimeCreated to the listing object
      listing.id = newListingKey;
      listing.dateTimeCreated = dateTimeCreated.toISOString();
      
      return db.ref(`listings/${newListingKey}`).set(listing)
        .then(() => {
          console.log('Listing added successfully with key:', newListingKey);
          return newListingKey; // Return the new listing key
        });
    })
    .catch(error => {
      console.error('Error adding item:', error);
      throw error;
    });
}

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// GET Retrieve specific listing based on id
app.get('/getListing/:listingId', (req, res) => {
  const listingId = req.params.listingId;
  db.ref(`listings/${listingId}`).once('value', snapshot => {
    const item = snapshot.val();
    res.json(item);
  }).catch(error => {
    res.status(500).json({ error: error.message });
  });
});

// GET listings based on Buyer ID
app.get('/getListingsByBuyer/:buyerId', (req, res) => {
  const buyerId = req.params.buyerId;
  db.ref('listings')
    .orderByChild('buyerId')
    .equalTo(parseInt(buyerId)) // Convert to integer if necessary
    .once('value')
    .then(snapshot => {
      const listings = snapshot.val();
      if (listings) {
        const listingsArray = Object.values(listings);
        res.json(listingsArray);
      } else {
        res.json([]); // Return an empty array if no listings found
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
      if (listings) {
        const listingsArray = Object.values(listings);
        res.json(listingsArray);
      } else {
        res.json([]); // Return an empty array if no listings found
      }
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
});


// POST Create listing
app.post('/createListing', (req, res) => {
  const newListing = req.body;
  addItemWithCounter(newListing)
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
  const updatedListing = req.body;
  db.ref(`listings/${listingId}`).update(updatedListing)
    .then(() => {
      res.json({ message: 'Listing updated successfully' });
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
});

// DELETE operation to remove data
app.delete('/deleteListing/:listingId', (req, res) => {
  const listingId = req.params.listingId;
  db.ref(`listings/${listingId}`).remove()
    .then(() => {
      res.json({ message: 'Listing deleted successfully' });
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
