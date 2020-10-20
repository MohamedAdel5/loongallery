<template>
  <v-card class="main" light v-if="dataFetched">
    <h2 class="text-center py-10 secondary--text">Change Ad</h2>
    <v-container class="d-flex flex-column align-content-space-around pa-10">
      <v-row>
        <v-col cols="12">
          <v-form v-model="valid" ref="form">
            <v-row>
              <p class="font-weight-bold secondary--text">
                Edit Fields
              </p>
            </v-row>
            <v-row>
              <v-col sm="3" cols="12" class="pa-0 d-flex align-center">
                <v-label>Ad Image (500x500)pixels</v-label>
              </v-col>
              <v-col sm="9" cols="12" class="pa-0">
                <v-file-input
                  dense
                  accept="image/*"
                  label="Select From Device..."
                  @change="selectFile"
                ></v-file-input>
              </v-col>
            </v-row>
            <v-row>
              <v-text-field v-model="adText" label="Ad text"></v-text-field>
            </v-row>

            <v-row class="mt-10">
              <v-col cols="12" class="pa-0" sm="6">
                <v-btn @click="applyChanges" max-width="200px" color="success"
                  >Apply Changes</v-btn
                ><span>{{ message }}</span>
              </v-col>
            </v-row>
            <v-row class="mt-10">
              <v-col cols="12" class="pa-0" sm="6">
                <v-alert type="error" v-if="responseResult === 'fail'"
                  >Failed to change the ad. Please contact the developers
                  team.</v-alert
                >
                <v-alert type="success" v-if="responseResult === 'success'"
                  >Ad is updated successfully.</v-alert
                >
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row class="mt-10">
              <v-col cols="12" class="pa-0" sm="6">
                <v-btn @click="deleteAd" max-width="200px" color="error"
                  >Remove Ad</v-btn
                ><span>{{ deleteMessage }}</span>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="pa-0" sm="6">
                <v-alert type="error" v-if="deleteResponseResult === 'fail'"
                  >Failed to delete the ad. Please contact the developers
                  team.</v-alert
                >
                <v-alert
                  type="success"
                  v-if="deleteResponseResult === 'success'"
                  >Ad is deleted successfully.</v-alert
                >
              </v-col>
            </v-row>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: "admin-edit-ads",
  data: () => ({
    dataFetched: false,
    valid: false,
    adText: null,
    adImage: null,
    fileRules: [v => !!v || "Select a file."],
    responseResult: "none",
    message: "",
    deleteResponseResult: "none",
    deleteMessage: ""
  }),
  methods: {
    selectFile(file) {
      this.adImage = file;
    },
    applyChanges: async function() {
      this.$refs.form.validate();
      if (!this.valid) {
        return;
      }
      this.message = "Please wait...";

      let formData = new FormData();
      formData.append("adImage", this.adImage);
      formData.append("adText", [this.adText]);
      try {
        const res = await this.$http.post(`/ads`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: this.$store.getters.adminAuthJwt
          }
        });
        if (res.status === 200) {
          this.responseResult = "success";
        } else this.responseResult = "fail";
      } catch (err) {
        this.responseResult = "fail";
      }
      this.message = "";
    },
    deleteAd: async function() {
      this.deleteMessage = "Please wait...";

      try {
        const res = await this.$http.delete(`/ads`, {
          headers: {
            Authorization: this.$store.getters.adminAuthJwt
          }
        });
        if (res.status === 200) {
          this.deleteResponseResult = "success";
        } else this.deleteResponseResult = "fail";
      } catch (err) {
        this.deleteResponseResult = "fail";
      }
      this.deleteMessage = "";
    }
  },
  mounted() {
    this.dataFetched = true;
  }
};
</script>

<style scoped>
h2 {
  font-family: "Advent Pro";
  font-size: 30px;
  font-weight: bolder;
}
.sizeRow {
  max-height: 50px;
}
.main {
  background-image: url("~@/assets/sketch-texture.png") !important;
  background-repeat: repeat;
  background-size: 600px 600px;
  background-color: black !important;
  border-radius: 10px !important;
}
</style>
