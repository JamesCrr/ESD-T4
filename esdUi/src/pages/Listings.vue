<template>
    <div class="content">
      <div class="md-layout">
        <div
          class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
        >
        <md-button class="md-primary md-lg" to="CreateAuction">Create Auction</md-button>
          <md-card class="md-card-plain">
            <md-card-header data-background-color="green">
              <h4 class="title">Created Auctions</h4>
            </md-card-header>
            <md-card-content>
              <listingsSeller></listingsSeller>
            </md-card-content>
          </md-card>
        </div>
      </div>
    </div>
</template>
  
<script>
import { ListingsSeller } from "@/components";

export default {
  components: {
    ListingsSeller,
  },
  data(){
    return{
      confirmDialogActive: false,
      listingName: "",
      listingDescription:"",
      sellerId: "3ae1a890-fa30-47c3-ac70-6a282d492b4b",
      startBid: 10.70,
      boosted: false,
      listingImg: ""
    }
  },
  methods: {
    createAuction(){

    }
  }
};
</script>