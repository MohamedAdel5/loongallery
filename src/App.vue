<template>
  <v-app v-if="dataFetched">
    <appbar />
    <v-main class="main-app">
      <router-view />
      <!-- <v-container>
        <v-row justify="center" align="center">
          <v-overlay
            class="d-block"
            z-index="12"
            opacity="0.8"
            v-if="showAnnouncement"
            :value="true"
          >
            <div v-click-outside="closeAnnouncement">
              <v-btn icon @click="closeAnnouncement">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-img
                :src="announcementImage"
                :max-height="announcementImageSize"
                :max-width="announcementImageSize"
              ></v-img>
            </div>
          </v-overlay>
        </v-row>
      </v-container> -->
      <v-row justify="center">
        <v-dialog v-model="showAnnouncement" dark overlay-opacity="0.5">
          <v-card @click="closeAnnouncement" color="rgba(0, 0, 0, 0.5)">
            <v-btn icon @click="closeAnnouncement">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-card-actions class="d-flex justify-center align-center">
              <v-img
                contain
                :src="announcementImage"
                :width="'100%'"
                :height="'100%'"
                :max-height="announcementImageSize"
                :max-width="announcementImageSize"
              ></v-img>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-main>

    <footer-component />
  </v-app>
</template>

<script>
import Appbar from "./components/Appbar";
import FooterComponent from "./components/FooterComponent";
import { validateTokenMixin } from "@/mixins/utilityMixins";
import { setUserMixin, setAnnouncementMixin } from "@/mixins/apiMixins";

export default {
  name: "App",
  mixins: [validateTokenMixin, setUserMixin, setAnnouncementMixin],
  components: {
    Appbar,
    FooterComponent
  },
  data: () => ({
    showAnnouncement: false,
    announcementImage: null,
    announcementImageSize: process.env.VUE_APP_ANNOUNCEMENT_IMAGE_SIZE,
    dataFetched: false
  }),
  methods: {
    getAnnouncement: async function() {
      this.announcementImage = await this.setAnnouncement();
      if (this.announcementImage) this.showAnnouncement = true;
    },
    closeAnnouncement: function() {
      this.showAnnouncement = false;
    }
  },
  watch: {
    "$store.state.authJwt": function() {
      //If the user somehow suddenly cleared his authJwt, set his login status to false
      if (!this.$store.getters.authJwt) {
        this.$store.dispatch("setLoggedInStatus", false);
        this.$store.dispatch("setUser", {});
      }
    }
  },
  mounted: async function() {
    document.title = "Loongallery";

    if (
      this.$route.name !== "admin" &&
      this.$route.name !== "admin-login" &&
      this.$route.name !== "not-found" &&
      this.$route.name !== "error"
    ) {
      const authJwt = localStorage.getItem("auth_jwt");
      const tokenValidationResult = this.validateToken(authJwt);

      if (tokenValidationResult === "valid" && this.setUser(authJwt)) {
        this.dataFetched = true;
        return;
      } else {
        localStorage.removeItem("auth_jwt");
      }
    }
    this.$store.dispatch("setAuthJwt", null);
    this.$store.dispatch("setLoggedInStatus", false);
    this.$store.dispatch("setUser", {});

    if (
      this.$route.name !== "admin" &&
      this.$route.name !== "admin-login" &&
      this.$route.name !== "not-found" &&
      this.$route.name !== "error" &&
      !this.$store.getters.loggedIn
    ) {
      await this.getAnnouncement();
    }

    this.dataFetched = true;
  }
};
</script>
<style>
@import "./assets/styles/commonStyles.css";

.v-application .white {
  background-color: transparent !important;
  border-color: transparent !important;
}
.theme--dark.v-tabs > .v-tabs-bar {
  background-color: transparent !important;
}
.main-app {
  background-image: url("~@/assets/black-wall-texture.png");
  background-repeat: repeat;
  background-color: black;
}
</style>
