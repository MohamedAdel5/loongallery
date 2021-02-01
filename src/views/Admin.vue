<template>
  <v-container
    v-if="dataFetched"
    :fluid="$vuetify.breakpoint.xsOnly"
    :class="$vuetify.breakpoint.xsOnly ? 'pa-0' : ''"
  >
    <banner />
    <v-container :class="$vuetify.breakpoint.xsOnly ? 'pa-0 pb-16' : 'pb-16'">
      <h1 class="text-center secondary--text my-10 font-weight-regular">
        {{ $t("admin_dashboard") }}
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
            <v-list-item-title class="white--text">{{
              $t("admin_dashboard")
            }}</v-list-item-title>
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
                itemTitle(item)
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
import AdminEditAnnouncements from "../components/AdminEditAnnouncements";
import AdminSendEmails from "../components/AdminSendEmails";
import { validateAdminTokenMixin } from "@/mixins/utilityMixins";
export default {
  name: "admin",
  mixins: [validateAdminTokenMixin],
  components: {
    AdminProducts,
    AdminOrders,
    Banner,
    AdminEditPrices,
    AdminDatabaseBackup,
    AdminEditAnnouncements,
    AdminSendEmails
  },
  data() {
    return {
      dataFetched: false,
      navbarTabs: [
        {
          icon: "mdi-phone-message",
          title: "Orders",
          title_ar: "الطلبات",
          component: "admin-orders"
        },
        {
          icon: "mdi-image",
          title: "Our Products",
          title_ar: "منتجاتنا",
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
          title_ar: "تعديل الأسعار",
          component: "admin-edit-prices"
        },
        {
          icon: "mdi-television-guide",
          title: "Edit Announcements",
          title_ar: "تعديل الاعلانات",
          component: "admin-edit-announcements"
        },
        {
          icon: "mdi-email",
          title: "Send Emails",
          title_ar: "ارسال بريد الكتروني",
          component: "admin-send-emails"
        },
        {
          icon: "mdi-content-save",
          title: "Database backup",
          title_ar: "حفظ قاعدة البيانات",
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
    itemTitle(item) {
      if (this.$root.$i18n.locale === "en") return item.title;
      else return item.title_ar;
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

    this.$router.push("/6324789123/admin/login").catch(() => {});
  }
};
</script>

<style scoped>
.myNav {
  background-color: black !important;
}
</style>
