<i18n>
{
  "en": {
		"Menu": "Menu"
		
  },
  "ar": {
		"Menu": "القائمة"
  }
}
</i18n>

<template>
  <div>
    <v-navigation-drawer v-model="drawer" app temporary dark>
      <v-list-item :to="'/home'">
        <v-list-item-avatar>
          <v-icon class="primary--text">mdi-home</v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title class="primary--text">{{
            $t("Menu")
          }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>
      <template v-if="!isAdmin">
        <v-list nav dense v-if="isLoggedIn">
          <v-list-item
            v-for="item in afterRegisterNavbarTabs"
            :key="item.title"
            link
            @click="item.action"
          >
            <v-list-item-icon class="primary--text">
              <v-icon class="primary--text">{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="primary--text">{{
                itemTitle(item)
              }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-list nav dense v-else>
          <v-list-item
            v-for="item in beforeRegisterNavbarTabs"
            :key="item.title"
            link
            :to="item.link"
          >
            <v-list-item-icon class="primary--text">
              <v-icon class="primary--text">{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="primary--text">{{
                itemTitle(item)
              }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>

    <v-app-bar
      id="appbar"
      class="primary--text secondary"
      dense
      app
      fixed
      elevate-on-scroll
    >
      <v-btn icon :to="'/home'">
        <v-img
          :src="require('@/assets/logo.jpg')"
          max-height="40px"
          max-width="40px"
          class="logo"
        />
      </v-btn>
      <v-btn text color="secondary" :to="'/home'" style="height: 100%"
        ><span class="primary--text">Loon Gallery</span></v-btn
      >

      <v-spacer></v-spacer>

      <v-toolbar-items>
        <v-btn color="secondary" x-small depressed @click="switchLocale">
          <v-img
            :src="flags[otherLocale]"
            max-height="16px"
            max-width="16px"
          ></v-img>
          <span class="primary--text px-2">{{ locales[otherLocale] }}</span>
        </v-btn>
        <template v-if="!isAdmin && $vuetify.breakpoint.smAndUp">
          <template v-if="isLoggedIn">
            <v-btn
              v-for="item in afterRegisterNavbarTabs"
              :key="item.title"
              @click="item.action"
              color="secondary"
              depressed
            >
              <span class="primary--text">{{ itemTitle(item) }}</span>
              <v-icon right class="primary--text">{{ item.icon }}</v-icon>
            </v-btn>
          </template>
          <template v-else>
            <v-btn
              v-for="item in beforeRegisterNavbarTabs"
              :key="item.title"
              :to="item.link"
              color="secondary"
              depressed
            >
              <span class="primary--text">{{ itemTitle(item) }}</span>
              <v-icon right class="primary--text">{{ item.icon }}</v-icon>
            </v-btn>
          </template>
        </template>
      </v-toolbar-items>

      <v-app-bar-nav-icon
        class="primary--text"
        @click="drawer = true"
        v-if="$vuetify.breakpoint.xsOnly && !isAdmin"
      />
    </v-app-bar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      navbarColor: "rgb(0,0,0,1)",

      drawer: false,
      flags: {
        en: require("@/assets/united-kingdom.png"),
        ar: require("@/assets/egypt.png")
      },
      locales: {
        en: "English",
        ar: "العربية"
      }
    };
  },
  computed: {
    isAdmin() {
      return this.$route.name === "admin";
    },
    isLoggedIn() {
      return this.$store.getters.loggedIn;
    },
    beforeRegisterNavbarTabs() {
      return [
        {
          icon: "mdi-login",
          title: "Login",
          title_ar: "تسجيل الدخول",
          link: "/login"
        },
        {
          icon: "mdi-account-plus",
          title: "Signup",
          title_ar: "إنشاء حساب جديد",
          link: "/signup"
        }
      ];
    },
    afterRegisterNavbarTabs() {
      return [
        {
          icon: "mdi-account",
          title: "Profile",
          title_ar: "حسابي",
          action: this.toProfile
        },
        {
          icon: "mdi-account-arrow-left",
          title: "Logout",
          title_ar: "تسجيل الخروج",
          action: this.logout
        }
      ];
    },
    otherLocale() {
      if (this.$root.$i18n.locale === "en") return "ar";
      else return "en";
    }
  },
  methods: {
    handleScroll: function() {
      const appbar = document.getElementById("appbar");
      window.addEventListener("scroll", () => {
        if (window.scrollY > 95) appbar.style.opacity = 0.5;
        else appbar.style.opacity = 1;
      });
    },
    logout: function() {
      localStorage.removeItem("auth_jwt");
      this.$store.dispatch("setAuthJwt", null);
      this.$store.dispatch("setLoggedInStatus", false);
      this.$store.dispatch("setUser", {});

      this.$router.push(`/home`).catch(() => {});
    },
    toProfile: function() {
      this.$router.push(`/my-profile`).catch(() => {});
    },
    switchLocale() {
      if (this.$root.$i18n.locale === "en") this.$root.$i18n.locale = "ar";
      else this.$root.$i18n.locale = "en";
    },
    itemTitle(item) {
      if (this.$root.$i18n.locale === "en") return item.title;
      else return item.title_ar;
    }
  },
  mounted() {
    this.handleScroll();
    //Set default language
    this.$root.$i18n.locale = "en";
  }
};
</script>

<style scoped>
.logo {
  border-radius: 20px;
}
#appbar {
  transition: opacity 0.25s ease-in-out;
}
</style>
