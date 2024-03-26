<template>
  <div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <md-card class="md-card-plain">
          <md-card-header data-background-color="green">
            <h4 class="title">Create Auction</h4>
          </md-card-header>
          <md-card-content>
            <div class="vertical-form">
              <md-field :class="getValidationClass('listingName')">
                <label>Listing Name</label>
                <md-input
                  v-model="listingName"
                  @blur="$v.listingName.$touch()"
                ></md-input>
                <span class="md-error" v-if="!$v.listingName.required"
                  >Listing name is required</span
                >
              </md-field>
              <md-field :class="getValidationClass('listingDescription')">
                <label>Listing Description</label>
                <md-input
                  v-model="listingDescription"
                  @blur="$v.listingDescription.$touch()"
                ></md-input>
                <span class="md-error" v-if="!$v.listingDescription.required"
                  >Listing description is required</span
                >
              </md-field>
              <md-field :class="getValidationClass('startBid')">
                <label>Start Bid</label>
                <md-input
                  v-model="startBid"
                  type="number"
                  @blur="$v.startBid.$touch()"
                ></md-input>
                <span class="md-error" v-if="!$v.startBid.required"
                  >Start bid is required</span
                >
                <span class="md-error" v-else-if="!$v.startBid.isValid"
                  >Invalid start bid</span
                >
              </md-field>
              <!-- <label>Upload Image</label>
                <md-field>
                    <input type="file" accept="image/*" @change="handleImageUpload">
                </md-field> -->
              <md-field>
                <label>Boosted</label>
                <md-switch
                  v-model="boosted"
                  style="margin-top: 50px"
                ></md-switch>
              </md-field>
            </div>
            <md-button
              class="md-primary"
              @click="createAuction"
              :disabled="$v.$invalid"
              >Create Auction</md-button
            >
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";

const createListingsUrl = "http://localhost:3030/createListing";

export default {
  mixins: [validationMixin],
  data() {
    return {
      listingName: "",
      listingDescription: "",
      startBid: 0,
      boosted: false,
    };
  },
  validations: {
    listingName: {
      required,
    },
    listingDescription: {
      required,
    },
    startBid: {
      required,
      isValid(value) {
        if (!Number.isInteger(value)) {
          const [, decimals] = value.toString().split(".");
          if (decimals && decimals.length > 2) {
            return false;
          }
        }
        return true;
      },
    },
  },
  methods: {
    createAuction() {
      // Prepare data for POST request
      const requestData = {
        listingName: this.listingName,
        listingDescription: this.listingDescription,
        sellerId: "3ae1a890-fa30-47c3-ac70-6a282d492b4b",
        startBid: this.startBid,
        boosted: this.boosted,
        listingImg: "asd123",
      };

      // POST request to create listing
      fetch(createListingsUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response error");
          }
          return response.json();
        })
        .then((data) => {
          //console.log("Listing created successfully:", data);
          this.$router.push({ name: "Listings" });
        })
        .catch((error) => {
          //console.error("Error creating listing:", error);
        });
    },
    getValidationClass(fieldName) {
      const field = this.$v[fieldName];

      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty,
        };
      }
    },
  },
};
</script>

<style scoped>
.vertical-form {
  display: flex;
  flex-direction: column;
}
</style>
