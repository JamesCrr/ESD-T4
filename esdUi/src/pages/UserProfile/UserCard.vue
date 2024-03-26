<template>
  <md-card class="md-card-profile">
    <div class="md-card-avatar">
      <img class="img" :src="cardUserImage" />
    </div>

    <md-card-content>
      <h6 class="category text-gray">Username:</h6>
      <h4 class="card-title">{{ username }}</h4>
      <p class="card-description">Wallet: {{ wallet }}</p>
    </md-card-content>
  </md-card>
</template>
<script>
//ID is hard coded
const getUserUrl =
  "https://personal-swk23gov.outsystemscloud.com/User_API/rest/v1/user/?userId=3ae1a890-fa30-47c3-ac70-6a282d492b4b";

export default {
  username: "test",
  wallet: 0,

  props: {
    cardUserImage: {
      type: String,
      default: require("@/assets/img/faces/marc.jpg"),
    },
  },
  data() {
    return {
      username: "",
      wallet: 0,
      message:"error",
    };
  },
  mounted() {
    this.getUser();
  },
  methods: {
    getUser() {
      fetch(getUserUrl)
        .then((response) => response.json())
        .then((data) => {
          this.username = data.AuctionUsers[0].username;
          this.wallet = data.AuctionUsers[0].wallet;
        })
        .catch((error) => {
          //console.error("Error fetching listings:", error);
          this.message = "Error fetching listings. Please try again later.";
        });
    },
  },
};
</script>
<style></style>
