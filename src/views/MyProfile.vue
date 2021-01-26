<template>
  <v-container
    v-if="dataFetched"
    :fluid="$vuetify.breakpoint.xsOnly"
    :class="$vuetify.breakpoint.xsOnly ? 'pa-0' : ''"
  >
    <banner />
    <v-container :class="$vuetify.breakpoint.xsOnly ? 'pa-0 pb-16' : 'pb-16'">
      <h1 class="text-center secondary--text my-10 font-weight-regular">
        My Profile
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
              >My Profile</v-list-item-title
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
import UserOrders from "../components/UserOrders";
import UserEditProfile from "../components/UserEditProfile";

export default {
  name: "my-profile",
  components: {
    Banner,
    UserOrders,
    UserEditProfile
  },
  data() {
    return {
      dataFetched: false,
      navbarTabs: [
        {
          icon: "mdi-phone-message",
          title: "My Orders",
          component: "user-orders"
        },
        {
          icon: "mdi-account-edit",
          title: "Edit Profile",
          component: "user-edit-profile"
        }
      ],
      currentComponent: "user-orders"
    };
  },
  methods: {},
  mounted: async function() {
    if (!this.$store.getters.authJwt)
      this.$router.push("/login").catch(() => {});
    this.dataFetched = true;
  }
};
</script>

<style scoped>
.myNav {
  background-color: black !important;
}
</style>
