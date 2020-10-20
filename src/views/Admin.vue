<template>
  <v-container
    v-if="dataFetched"
    :fluid="$vuetify.breakpoint.xsOnly"
    :class="$vuetify.breakpoint.xsOnly ? 'pa-0' : ''"
  >
    <banner />
    <v-container :class="$vuetify.breakpoint.xsOnly ? 'pa-0 pb-16' : 'pb-16'">
      <h1 class="text-center secondary--text my-10 font-weight-regular">
        Admin Dashboard
      </h1>
      <v-navigation-drawer
        dark
        app
        hide-overlay
        permanent
        mini-variant
        expand-on-hover
        class="myNav"
      >
        <v-list-item
          @click="currentComponent = navbarTabs[0].component"
          :to="$route.name"
        >
          <v-list-item-icon>
            <v-icon class="secondary--text">mdi-home</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="white--text"
              >Admin Dashboard</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list nav dense>
          <v-list-item
            v-for="item in navbarTabs"
            :key="item.title"
            link
            @click="currentComponent = item.component"
          >
            <v-list-item-icon class="primary--text">
              <v-icon class="secondary--text">{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="white--text">{{
                item.title
              }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-container
        :fluid="$vuetify.breakpoint.xsOnly"
        :class="$vuetify.breakpoint.xsOnly ? 'pa-0' : ''"
        class="d-flex flex-column justify-center"
      >
        <component v-bind:is="currentComponent"></component>
      </v-container>
    </v-container>
  </v-container>
</template>

<script>
import Banner from "../components/Banner";
import AdminProducts from "../components/AdminProducts";
import AdminOrders from "../components/AdminOrders";
import AdminEditPrices from "../components/AdminEditPrices";
import AdminDatabaseBackup from "../components/AdminDatabaseBackup";
import AdminEditAds from "../components/AdminEditAds";
import AdminSendEmails from "../components/AdminSendEmails";

export default {
  name: "Admin",
  components: {
    AdminProducts,
    AdminOrders,
    Banner,
    AdminEditPrices,
    AdminDatabaseBackup,
    AdminEditAds,
    AdminSendEmails
  },
  data() {
    return {
      dataFetched: false,
      navbarTabs: [
        {
          icon: "mdi-phone-message",
          title: "Current Orders",
          component: "admin-orders"
        },
        {
          icon: "mdi-image",
          title: "Our Products",
          component: "admin-products"
        },
        // {
        //   icon: "mdi-chart-bell-curve",
        //   title: "View Statistics",
        //   component: "admin-statistics"
        // },
        {
          icon: "mdi-currency-usd",
          title: "Edit Prices",
          component: "admin-edit-prices"
        },
        {
          icon: "mdi-television-guide",
          title: "Edit Ads",
          component: "admin-edit-ads"
        },
        {
          icon: "mdi-email",
          title: "Send Emails",
          component: "admin-send-emails"
        },
        {
          icon: "mdi-content-save",
          title: "Database backup",
          component: "admin-database-backup"
        }
      ],
      currentComponent: "admin-orders"
    };
  },
  watch: {
    "$store.state.adminAuthJwt": function() {
      //If the user somehow suddenly cleared his authJwt, set his login status to false
      if (!this.$store.getters.adminAuthJwt) {
        this.$store.dispatch("setAdminLoggedInStatus", false);
        this.$store.dispatch("setAdmin", {});
      }
    }
  },
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
    validateAdminToken: function(token) {
      if (token) {
        const jwtObject = this.parseJwt(token);
        if (!jwtObject.admin) return "invalid";
        if (Date.now() >= jwtObject.exp * 1000) {
          return "expired";
        } else {
          return "valid";
        }
      } else {
        return "invalid";
      }
    }
  },
  mounted: async function() {
    const adminAuthJwt = sessionStorage.getItem("admin_auth_jwt");
    const tokenValidationResult = this.validateAdminToken(adminAuthJwt);
    if (
      tokenValidationResult === "valid" &&
      this.$store.getters.adminAuthJwt &&
      Object.keys(this.$store.getters.admin).length !== 0
    ) {
      //Valid admin
      this.dataFetched = true;
      return;
    } else if (tokenValidationResult === "expired") {
      sessionStorage.removeItem("admin_auth_jwt");
    }

    this.$store.dispatch("setAdminAuthJwt", null);
    this.$store.dispatch("setAdminLoggedInStatus", false);
    this.$store.dispatch("setAdmin", {});

    this.$router.push("/6324789123/admin/login");
  }
};
</script>

<style scoped>
.myNav {
  background-color: black !important;
}
</style>
