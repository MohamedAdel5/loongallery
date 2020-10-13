<template>
  <v-app v-if="dataFetched">
    <appbar />
    <v-main class="main-app">
      <router-view />
    </v-main>

    <footer-component />
  </v-app>
</template>

<script>
import Appbar from "./components/Appbar";
import FooterComponent from "./components/FooterComponent";

export default {
  name: "App",

  components: {
    Appbar,
    FooterComponent
  },
  data: () => ({
    dataFetched: false
  }),
  methods: {
    parseJwt: function(token) {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function(c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      return JSON.parse(jsonPayload);
    },
    validateToken: function(token) {
      if (token) {
        const jwtObject = this.parseJwt(token);
        if (Date.now() >= jwtObject.exp * 1000) {
          return "expired";
        } else {
          return "valid";
        }
      } else {
        return "invalid";
      }
    },
    getUser: async function(token) {
      const res = await this.$http.get(`/users/me`, {
        headers: { Authorization: token }
      });
      this.$store.dispatch("setUser", res.data.user);
      this.$store.dispatch("setAuthJwt", token);
      this.$store.dispatch("setLoggedInStatus", true);
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
    if (this.$route.name !== "admin" && this.$route.name !== "admin-login") {
      const authJwt = localStorage.getItem("auth_jwt");
      const tokenValidationResult = this.validateToken(authJwt);

      if (tokenValidationResult === "valid") {
        this.getUser(authJwt);
        this.dataFetched = true;
        return;
      } else if (tokenValidationResult === "expired") {
        localStorage.removeItem("auth_jwt");
      }
    }
    this.$store.dispatch("setAuthJwt", null);
    this.$store.dispatch("setLoggedInStatus", false);
    this.$store.dispatch("setUser", {});

    this.dataFetched = true;
  }
};
</script>
<style>
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
