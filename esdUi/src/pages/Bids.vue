<template>
  <div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <md-card class="md-card-plain">
          <md-card-header data-background-color="green">
            <h4 class="title">Ongoing Bids</h4>
          </md-card-header>
          <md-card-content>
          </md-card-content>
        </md-card>
        <BidListings></BidListings>
      </div>
    </div>
  </div>
</template>

<script>
import BidListings from '../components/Tables/BidListings.vue';

export default {
  components: {
    BidListings
  },
};
</script>
