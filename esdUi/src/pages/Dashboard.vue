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
};
</script>