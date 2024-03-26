<template>
    <div>
        <md-table v-model="listings" :table-header-color="tableHeaderColor">
            <md-table-row>
                <md-table-head>Seller</md-table-head>
                <md-table-head>Name</md-table-head>
                <md-table-head>Highest Bid</md-table-head>
                <md-table-head>Description</md-table-head>
                <md-table-head>Bid</md-table-head>
            </md-table-row>

            <template v-for="(listingsArray, username) in listings" >
                <md-table-row :key="username">
                    <md-table-cell :rowspan="listingsArray.length + 1">{{ username }}</md-table-cell>
                </md-table-row>
                <md-table-row v-for="listing in listingsArray" :key="listing.listingId">
                    <md-table-cell>{{ listing.listingName }}</md-table-cell>
                    <md-table-cell>{{ listing.highestBid }}</md-table-cell>
                    <md-table-cell>{{ listing.listingDescription }}</md-table-cell>
                    <md-table-cell>
                        <md-button class="md-info">Place Bid</md-button>
                    </md-table-cell>
                </md-table-row>
            </template>

        </md-table>
    </div>
</template>
  
  <script>
  const showListingsURL = "http://localhost:3013/getAllOpenListing";

  const bidUrl = "http://localhost:3015";

  export default {  
    name: "homeListings",
    props: {
      tableHeaderColor: {
        type: String,
        default: "",
      },
    },
    data() {
      return {
        listings: [],
        bidPrice: 0,
        selectedListingId: null,
        userId:null,
        message: "There is a problem retrieving listings data, please try again later.",
      };
    },
    mounted() {
        this.getAllListings();
    },
    methods: {
        getAllListings() {
            fetch(showListingsURL)
            .then(response => response.json())
            .then(data => {
                this.listings = data;
            })
            .catch(error => {
              //console.error("Error fetching listings:", error);
              this.message = "Error fetching listings. Please try again later.";
            });
        },
        showBidModal(listingId) {
        
        },
        submitBid() {
          const newBid = parseFloat(this.bidPrice);
          const listingId = this.selectedListingId;
          
          // Prepare data for POST request
          const requestData = {
            name: this.auctionName,
            bidPrice: newBid,
            userId: "7f3b428f-050c-446b-ac9d-7176b3f11b14",
            listingId: this.selectedListingId
          };
          // POST request to bid
          fetch(bidUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response error');
            }
            return response.json();
          })
          .then(data => {
            // Check if bid was successful
            if (data.success) {
                // Display success message
                this.successMessage = "Bid submitted successfully!";
                // Close the modal
                //$('#bidModal').modal('hide');
            } else {
                // Display error message
                this.errorMessage = "Error submitting bid. Please try again later.";
            }
          })
          .catch(error => {
            //console.error('Error creating bid:', error);
            this.errorMessage = "Error creating bid. Please try again later.";
            //document.getElementById("errorMessage").style.display = "block";
          });
          
          //console.log(`Bid submitted for ${listingId}: $${newBid}`);
          this.selectedListingId = null;
          // Close the modal
          //$('#bidModal').modal('hide');
        }
    },

  };
  </script>
  