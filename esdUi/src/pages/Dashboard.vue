<template>
  <div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title">Ongoing Auctions</h4>
          </md-card-header>
          <md-card-content>
            <homeListings table-header-color="green"></homeListings>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import { HomeListings } from "@/components";

export default {
  components: {
    HomeListings,
  },
  // submitBid() {
  //         //const listing = this.listings[this.selectedListingId];
  //         const newBid = parseFloat(this.bidPrice);
  //         const listingId = this.selectedListingId;
  //         console.log(this.selectedListingId);
  //         // Prepare data for POST request
  //         const requestData = {
  //           listingName: this.auctionName,
  //           bidPrice: newBid,
  //           userId: "7f3b428f-050c-446b-ac9d-7176b3f11b14",
  //           listingId: this.selectedListingId
  //         };
  //         // POST request to bid
  //         fetch(bidUrl, {
  //           method: 'POST',
  //           headers: {
  //             'Content-Type': 'application/json'
  //           },
  //           body: JSON.stringify(requestData)
  //         })
  //         .then(response => {
  //           if (!response.ok) {
  //             throw new Error('Network response error');
  //           }
  //           return response.json();
  //         })
  //         .then(data => {
  //           // Check if bid was successful
  //           if (data.success) {
  //               // Display success message
  //               this.successMessage = "Bid submitted successfully!";
  //               // Close the modal
  //               $('#bidModal').modal('hide');
  //           } else {
  //               // Display error message
  //               this.errorMessage = "Error submitting bid. Please try again later.";
  //           }
  //         })
  //         .catch(error => {
  //           console.error('Error creating bid:', error);
  //           this.errorMessage = "Error creating bid. Please try again later.";
  //           document.getElementById("errorMessage").style.display = "block";
  //         });

  //         console.log(`Bid submitted for ${listingId}: $${newBid}`);
  //         this.selectedListingId = null;
  //         // Close the modal
  //         $('#bidModal').modal('hide');
  //       }
};
</script>
