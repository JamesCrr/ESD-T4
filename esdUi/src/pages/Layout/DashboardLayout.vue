<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <notifications></notifications>

    <side-bar
      :sidebar-item-color="sidebarBackground"
      :sidebar-background-image="sidebarBackgroundImage"
    >
    
      <sidebar-link to="/dashboard">
        <md-icon>dashboard</md-icon>
        <p>Dashboard</p>
      </sidebar-link>
      <sidebar-link to="/user">
        <md-icon>person</md-icon>
        <p>Profile</p>
      </sidebar-link>
      <sidebar-link to="/listings">
        <md-icon>content_paste</md-icon>
        <p>Listings</p>
      </sidebar-link>
      <sidebar-link to="/bids">
        <md-icon>content_paste</md-icon>
        <p>Bids</p>
      </sidebar-link>
    </side-bar>

    <div class="main-panel">
      <dashboard-content> </dashboard-content>
    </div>
  </div>
</template>

<script>
import DashboardContent from "./Content.vue";

export default {
  components: {
    DashboardContent,
  },
  data() {
    return {
      sidebarBackground: "green",
      sidebarBackgroundImage: require("@/assets/img/sidebar-2.jpg"),
    };
  },
};
</script>