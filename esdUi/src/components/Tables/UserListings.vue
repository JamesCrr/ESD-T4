<template>
    <div>
      <masonry :cols="3" :gutter="20">
        <div
          v-for="(item, index) in listings"
          :key="index"
          class="card-expansion"
        >
          <md-card>
            <md-card-media>
              <img
              :src="require(`../../assets/img/listing_images/${item.listingImg}.png`)"
              style=" width: 300px; height: 150px; "
                alt="Listing Image"
              />
            </md-card-media>
  
            <md-card-header>
              <div class="md-title">{{ item.listingName }}</div>
              <div class="md-subhead">Current bid: {{ item.highestBid }}</div>
            </md-card-header>
  
            <md-card-expand>
              <md-card-actions md-alignment="space-between">
                <div>
                   <md-button>Edit Listing</md-button>
                  <md-button>Close Listing</md-button>
                </div>
  
                <md-card-expand-trigger>
                  <md-button class="md-icon-button">
                    <md-icon>keyboard_arrow_down</md-icon>
                  </md-button>
                </md-card-expand-trigger>
              </md-card-actions>
  
              <md-card-expand-content>
                <md-card-content>
                  {{ item.listingDescription }}
                </md-card-content>
              </md-card-expand-content>
            </md-card-expand>
          </md-card>
        </div>
      </masonry>
      <!-- <md-table v-model="listings" :table-header-color="tableHeaderColor">
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
  
          </md-table> -->
    </div>
  </template>
  
  <style lang="scss" scoped>
  .card-expansion {
    height: 480px;
  }
  
  .md-card {
    width: 320px;
    margin: 4px;
    display: inline-block;
    vertical-align: top;
  }
  </style>
  
  <script>
  const showListingsURL = "http://localhost:3013/getAllOpenListing";
  
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
        userId: null,
        message:
          "There is a problem retrieving listings data, please try again later.",
      };
    },
    mounted() {
      this.getAllListings();
    },
    methods: {
      getAllListings() {
        fetch(showListingsURL)
          .then((response) => response.json())
          .then((data) => {

            // Sort items by boosted property
            const retrivedData = Object.values(data).flatMap((arr) => arr);
            retrivedData.sort((a, b) => {
              if (a.boosted == b.boosted) {
                return 0;
              }
              return a.boosted ? 1 : -1;
            });
            retrivedData.reverse();
            const filteredData = retrivedData.filter(data => data.sellerId === '3ae1a890-fa30-47c3-ac70-6a282d492b4b')
            this.listings = filteredData;
          })
          .catch((error) => {
            //console.error("Error fetching listings:", error);
            this.message = "Error fetching listings. Please try again later.";
          });
      },
      showBidModal(listingId) {},
    },
  };
  </script>
  