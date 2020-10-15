import Vue from "vue";
import App from "./App.vue";
import store from "./store/store";
import router from "./router/router";
import vuetify from "./plugins/vuetify";
import axios from "axios";

Vue.prototype.$http = axios.create({
  baseURL: `${process.env.VUE_APP_API_BASE_URL}`,
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
