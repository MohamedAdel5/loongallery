<template>
  <v-card class="main" light v-if="dataFetched">
    <h2 class="text-center py-10 secondary--text">Change Announcement</h2>
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
                <v-label>Announcement Image (500x500)pixels</v-label>
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
              <v-text-field
                v-model="announcementText"
                label="Announcement text"
              ></v-text-field>
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
                  >Failed to change the announcement. Please contact the
                  developers team.</v-alert
                >
                <v-alert type="success" v-if="responseResult === 'success'"
                  >Announcement is updated successfully.</v-alert
                >
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row class="mt-10">
              <v-col cols="12" class="pa-0" sm="6">
                <v-btn
                  @click="deleteAnnouncement"
                  max-width="200px"
                  color="error"
                  >Remove Announcement</v-btn
                ><span>{{ deleteMessage }}</span>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="pa-0" sm="6">
                <v-alert type="error" v-if="deleteResponseResult === 'fail'"
                  >Failed to delete the announcement. Please contact the
                  developers team.</v-alert
                >
                <v-alert
                  type="success"
                  v-if="deleteResponseResult === 'success'"
                  >Announcement is deleted successfully.</v-alert
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
import {
  editAnnouncementMixin,
  deleteAnnouncementMixin
} from "@/mixins/apiMixins";

export default {
  name: "admin-edit-announcements",
  mixins: [editAnnouncementMixin, deleteAnnouncementMixin],
  data: () => ({
    dataFetched: false,
    valid: false,
    announcementText: null,
    announcementImage: null,
    fileRules: [v => !!v || "Select a file."],
    responseResult: "none",
    message: "",
    deleteResponseResult: "none",
    deleteMessage: ""
  }),
  methods: {
    selectFile(file) {
      this.announcementImage = file;
    },
    applyChanges: async function() {
      this.$refs.form.validate();
      if (!this.valid) {
        return;
      }
      this.message = "Please wait...";

      let formData = new FormData();
      formData.append("announcementImage", this.announcementImage);
      formData.append("announcementText", [this.announcementText]);
      this.responseResult = (await this.editAnnouncement(formData))
        ? "success"
        : "fail";
      this.message = "";
    },
    deleteAnnouncement: async function() {
      this.deleteMessage = "Please wait...";
      this.deleteResponseResult = (await this.deleteAnnouncement())
        ? "success"
        : "fail";
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
</style>
