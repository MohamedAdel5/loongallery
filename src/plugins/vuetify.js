import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#000000",
        secondary: "#be7c09"
      }
    },
    light: true
  }
});
