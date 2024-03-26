<template>
  <div>
    <md-table v-model="listings" :table-header-color="tableHeaderColor">
      <md-table-row>
        <md-table-head>#</md-table-head>
        <md-table-head>Highest Bid</md-table-head>
        <md-table-head>Description</md-table-head>
        <md-table-head>Bid</md-table-head>
      </md-table-row>

      <md-table-row v-for="(listing, index) in listings" :key="index">
        <md-table-cell>{{ index + 1 }}</md-table-cell>
        <md-table-cell>{{ listing.listingName }}</md-table-cell>
        <md-table-cell>{{ listing.highestBid }}</md-table-cell>
        <md-table-cell>{{ listing.listingDescription }}</md-table-cell>
        <md-table-cell>
          <md-button
            :disabled="!listing.status"
            :class="{ 'md-danger': listing.status }"
            @click="showConfirmationDialog(listing)"
          >
            End Auction
          </md-button>
        </md-table-cell>
      </md-table-row>
    </md-table>

    <md-dialog :md-active.sync="confirmDialogActive">
      <md-dialog-title>Confirm End Auction</md-dialog-title>
      <md-dialog-content
        >Are you sure you want to end this auction?</md-dialog-content
      >
      <md-dialog-actions>
        <md-button @click="confirmDialogActive = false">No</md-button>
        <md-button class="md-info" @click="closeAuction(selectedListing)"
          >Yes</md-button
        >
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
//SellerId is hard coded
const getListingsURL =
  "http://localhost:9999/getListingsBySeller/3ae1a890-fa30-47c3-ac70-6a282d492b4b";

export default {
  name: "listingsSeller",
  props: {
    tableHeaderColor: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      listings: [],
      message:
        "There is a problem retrieving listings data, please try again later.",
      confirmDialogActive: false,
      selectedListing: null,
    };
  },
  mounted() {
    this.getAllListings();
  },
  methods: {
    getAllListings() {
      fetch(getListingsURL)
        .then((response) => response.json())
        .then((data) => {
          this.listings = data;
        })
        .catch((error) => {
          //console.error("Error fetching listings:", error);
          this.message = "Error fetching listings. Please try again later.";
        });
    },
    showConfirmationDialog(listing) {
      this.selectedListing = listing;
      this.confirmDialogActive = true;
    },
    closeAuction(selectedListing) {
      // TODO
      // Implement logic to close auction
    },
  },
};
</script>
