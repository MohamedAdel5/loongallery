<template>
  <div id="home">
    <banner />
    <v-container class="d-flex flex-column justify-center pt-0 pb-16">
      <v-card tile flat class="main">
        <v-tabs
          v-model="tabIndex"
          show-arrows
          background-color="white"
          centered
          dark
          class="secondary--text main"
        >
          <v-tab
            v-for="item in tabs"
            @click="redirect(item.component)"
            :key="item.component"
            class="secondary--text main"
          >
            {{ item.title }}
          </v-tab>
        </v-tabs>
        <component v-bind:is="tabs[tabIndex].component"></component>
      </v-card>
    </v-container>
    <v-tooltip left style="z-index: 11">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          dark
          fab
          bottom
          right
          fixed
          color="orange"
          v-bind="attrs"
          v-on="on"
          style="z-index: 11"
          :to="'/shopping-cart'"
        >
          <v-icon>mdi-cart</v-icon>
        </v-btn>
      </template>
      <span>View Your Shopping Cart</span>
    </v-tooltip>
  </div>
</template>

<script>
import Banner from "../components/Banner";
import OurProducts from "../components/OurProducts";
import CustomizedPortraits from "../components/CustomizedPortraits";

export default {
  name: "Home",
  components: {
    Banner,
    OurProducts,
    CustomizedPortraits
  },
  data() {
    return {
      tabIndex: 0,
      tabs: [
        { title: "Our Products", component: "our-products" },
        { title: "Customized Portraits", component: "customized-portraits" }
      ]
    };
  },
  methods: {
    redirect: function(component) {
      if (component !== this.$route.params.component)
        this.$router.push(`/home/${component}`);
    }
  },
  watch: {
    $route(to) {
      // react to route changes...
      const component = to.params.component;
      this.tabIndex = this.tabs.findIndex(tab => {
        return tab.component === component;
      });
    }
  },
  // // This Can be used instead of watching $route
  // beforeRouteUpdate(to, from, next) {
  //   // react to route changes...
  //   const component = to.params.component;
  //   this.tabIndex = this.tabs.findIndex(tab=>{return tab.component === component});
  //   next();
  // },
  mounted() {
    const component = this.$route.params.component;
    this.tabIndex = this.tabs.findIndex(tab => {
      return tab.component === component;
    });
  }
};
</script>

<style scoped>
.main {
  /* background-image: url("~@/assets/black-wall-texture.png") !important;
  background-repeat: repeat; */
  background-color: transparent !important;
}
</style>
