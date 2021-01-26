<template>
  <div id="home">
    <banner />
    <v-container class="d-flex flex-column justify-center pt-0 pb-16">
      <v-card tile flat color="rgba(0,0,0,0)">
        <v-tabs
          v-model="tabIndex"
          show-arrows
          background-color="rgba(0,0,0,0)"
          centered
          dark
          class="secondary--text"
        >
          <v-tab
            v-for="item in tabs"
            @click="redirect(item.component)"
            :key="item.component"
            class="secondary--text"
          >
            {{ item.title }}
          </v-tab>
        </v-tabs>
        <component v-bind:is="tabs[tabIndex].component"></component>
      </v-card>
    </v-container>
    <v-tooltip v-model="showCartTooltip" left style="z-index: 11">
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
          <template v-if="$store.getters.cart.length > 0">
            <v-badge
              color="red"
              style="z-index: 15"
              :content="String($store.getters.cart.length)"
            >
              <v-icon>mdi-cart</v-icon>
            </v-badge>
          </template>
          <template v-else>
            <v-icon>mdi-cart</v-icon>
          </template>
        </v-btn>
      </template>
      <span v-if="productIsAdded">A Product Is Added To Your Cart.</span>
      <span v-else>View Your Shopping Cart</span>
    </v-tooltip>
  </div>
</template>

<script>
import Banner from "../components/Banner";
import OurProducts from "../components/OurProducts";
import CustomizedPortraits from "../components/CustomizedPortraits";

export default {
  name: "home",
  components: {
    Banner,
    OurProducts,
    CustomizedPortraits
  },
  data() {
    return {
      tabIndex: 0,
      showCartTooltip: false,
      productIsAdded: false,
      tabs: [
        { title: "Our Products", component: "our-products" },
        { title: "Customized Portraits", component: "customized-portraits" }
      ]
    };
  },
  methods: {
    redirect: function(component) {
      if (component !== this.$route.params.component)
        this.$router.push(`/home/${component}`).catch(() => {});
    },
    showProductAddedTooltip: function() {
      this.productIsAdded = true;
      this.showCartTooltip = true;
      setTimeout(() => {
        this.showCartTooltip = false;
        this.productIsAdded = false;
      }, 3000);
    }
  },
  watch: {
    $route(to) {
      // react to route changes...
      const component = to.params.component;
      this.tabIndex = this.tabs.findIndex(tab => {
        return tab.component === component;
      });
    },
    "$store.state.cart.length": function(newCount, oldCount) {
      if (newCount > oldCount) {
        this.showProductAddedTooltip();
      }
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

<style scoped></style>
