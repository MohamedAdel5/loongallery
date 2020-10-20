import Vue from "vue";
import App from "./App.vue";
import store from "./store/store";
import router from "./router/router";
import vuetify from "./plugins/vuetify";
import axios from "axios";

const baseURL =
  process.env.VUE_APP_NODE_ENV === "production"
    ? process.env.VUE_APP_API_BASE_URL
    : process.env.VUE_APP_API_BASE_URL_DEVELOPMENT;

Vue.prototype.$http = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount("#app");
