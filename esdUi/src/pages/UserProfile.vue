<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-size-33">
    
        <user-card> </user-card>
      </div>

      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
        style="margin-top: 10px;"
      >
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title">Your listings</h4>
          </md-card-header>
          <md-card-content>
            <UserListing table-header-color="green"></UserListing>
          </md-card-content>
        </md-card>
      </div>
    </div>
    
  </div>
</template>

<script>
import { UserCard } from "@/pages";
import { UserListing } from "@/components";

export default {
  components: {
    UserCard,
    UserListing,
  },
};
</script>
