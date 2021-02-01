<template>
  <v-card class="main" light v-if="dataFetched">
    <h2 class="text-center py-10 secondary--text">
      {{ $t("change_announcement") }}t
    </h2>
    <v-container class="d-flex flex-column align-content-space-around pa-10">
      <v-row>
        <v-col cols="12">
          <v-form v-model="valid" ref="form" :key="$root.$i18n.locale">
            <v-row>
              <p class="font-weight-bold secondary--text">
                {{ $t("edit_fields") }}
              </p>
            </v-row>
            <v-row>
              <v-col sm="3" cols="12" class="pa-0 d-flex align-center">
                <v-label>{{ $t("announcement_image") }} (500x500)px</v-label>
              </v-col>
              <v-col sm="9" cols="12" class="pa-0">
                <v-file-input
                  dense
                  accept="image/*"
                  :label="$t('select_image')"
                  @change="selectFile"
                ></v-file-input>
              </v-col>
            </v-row>
            <v-row>
              <v-text-field
                v-model="announcementText"
                :label="$t('announcement_text')"
              ></v-text-field>
            </v-row>

            <v-row class="mt-10">
              <v-col cols="12" class="pa-0" sm="6">
                <v-btn @click="applyChanges" max-width="200px" color="success"
                  >{{ $t("submit") }}s</v-btn
                ><span>{{ message }}</span>
              </v-col>
            </v-row>
            <v-row class="mt-10">
              <v-col cols="12" class="pa-0" sm="6">
                <v-alert type="error" v-if="responseResult === 'fail'">{{
                  $t("edit_err")
                }}</v-alert>
                <v-alert type="success" v-if="responseResult === 'success'">{{
                  $t("edit_success")
                }}</v-alert>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row class="mt-10">
              <v-col cols="12" class="pa-0" sm="6">
                <v-btn
                  @click="deleteAnnouncement"
                  max-width="200px"
                  color="error"
                  >{{ $t("remove_announcement") }}</v-btn
                ><span>{{ deleteMessage }}</span>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="pa-0" sm="6">
                <v-alert type="error" v-if="deleteResponseResult === 'fail'">{{
                  $t("delete_fail")
                }}</v-alert>
                <v-alert
                  type="success"
                  v-if="deleteResponseResult === 'success'"
                  >{{ $t("delete_success") }}</v-alert
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
  data() {
    return {
      dataFetched: false,
      valid: false,
      announcementText: null,
      announcementImage: null,
      fileRules: [v => !!v || this.$t("file_err")],
      responseResult: "none",
      message: "",
      deleteResponseResult: "none",
      deleteMessage: ""
    };
  },
  methods: {
    selectFile(file) {
      this.announcementImage = file;
    },
    applyChanges: async function() {
      this.$refs.form.validate();
      if (!this.valid) {
        return;
      }
      this.message = this.$t("please_wait");

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
