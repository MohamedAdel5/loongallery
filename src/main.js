import Vue from "vue";
import App from "./App.vue";
import store from "./store/store";
import router from "./router/router";
import vuetify from "./plugins/vuetify";
import axios from "axios";

Vue.prototype.$http = axios.create({
  baseURL: `http://localhost:8000/api/v1`,
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
