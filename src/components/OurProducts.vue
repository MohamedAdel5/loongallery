<template>
  <v-card tile flat class="main mb-16" v-if="dataFetched">
    <h2 class="text-center py-10 secondary--text">Our Products</h2>
    <v-container class="d-flex flex-column align-content-space-around">
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
          :key="item.category"
          @click="getProducts(item.category, 1)"
          class="secondary--text main"
        >
          {{ item.title }}
        </v-tab>
      </v-tabs>
      <!-- <v-row>
        <v-col
          cols="12"
          sm="6"
          class="d-flex justify-start"
          :class="$vuetify.breakpoint.xsOnly ? 'pa-0' : 'pa-4'"
        >
          <v-pagination
            v-model="page"
            :length="pagesCount"
            :total-visible="$vuetify.breakpoint.smAndDown ? 3 : pagesCount"
            circle
            color="secondary"
            dark
          ></v-pagination>
        </v-col>
        <v-col cols="0" sm="3"></v-col>
        <v-col class="d-flex justify-end pr-10" cols="12" sm="3">
          <v-select
            :items="sortByOptions"
            label="Sort By"
            dark
            width="500px"
            solo
            dense
            rounded
            class="selector"
          ></v-select>
        </v-col>
      </v-row> -->
      <v-row>
        <v-col cols="12" :class="$vuetify.breakpoint.xsOnly ? 'pa-0' : 'pa-4'">
          <v-pagination
            v-model="page"
            :length="pagesCount"
            :total-visible="$vuetify.breakpoint.smAndDown ? 3 : pagesCount"
            circle
            color="secondary"
            dark
            @input="getProducts(currentCategory, page)"
          ></v-pagination>
        </v-col>
      </v-row>
      <v-row
        v-for="i in Math.floor(productsCount / elementsPerRow)"
        :key="i"
        class="d-flex flex-row justify-space-around"
      >
        <v-col
          v-for="j in elementsPerRow"
          :key="j"
          class="d-flex flex-column flex-grow-0 mt-4"
        >
          <router-link
            :to="`/product/${products[(i - 1) * elementsPerRow + (j - 1)]._id}`"
            class="productLink"
          >
            <product-card
              :prices="generalProductPrices"
              :title="
                `${tabs[tabIndex].title}-${
                  products[(i - 1) * elementsPerRow + (j - 1)].skuCode
                }`
              "
              :imageSrc="products[(i - 1) * elementsPerRow + (j - 1)].image"
            />
          </router-link>
        </v-col>
      </v-row>

      <v-row class="d-flex flex-row justify-space-around">
        <v-col
          v-for="j in productsCount -
            Math.floor(productsCount / elementsPerRow) * elementsPerRow"
          :key="j"
          class="d-flex flex-column flex-grow-0 mt-4"
        >
          <router-link
            :to="
              `/product/${
                products[
                  Math.floor(productsCount / elementsPerRow) * elementsPerRow +
                    (j - 1)
                ]._id
              }`
            "
            class="productLink"
          >
            <product-card
              :prices="generalProductPrices"
              :title="
                `${tabs[tabIndex].title}-${
                  products[
                    Math.floor(productsCount / elementsPerRow) *
                      elementsPerRow +
                      (j - 1)
                  ].skuCode
                }`
              "
              :imageSrc="
                products[
                  Math.floor(productsCount / elementsPerRow) * elementsPerRow +
                    (j - 1)
                ].image
              "
            />
          </router-link>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12"
          ><v-pagination
            v-model="page"
            :length="pagesCount"
            :total-visible="$vuetify.breakpoint.smAndDown ? 3 : pagesCount"
            circle
            color="secondary"
            dark
            @input="getProducts(currentCategory, page)"
          ></v-pagination
        ></v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import ProductCard from "./ProductCard";

export default {
  name: "our-portraits",
  components: {
    ProductCard
  },
  watch: {},
  data() {
    return {
      dataFetched: false,
      productsCount: 0,
      elementsPerRow: 3,
      elementsPerPage: process.env.VUE_APP_PRODUCTS_ELEMENTS_PER_PAGE,
      page: 1,
      pagesCount: 1,
      tabIndex: 0,
      tabs: [
        { title: "Decoration Tableau", category: "Decoration tableau" },
        { title: "Mersal", category: "Mersal" },
        { title: "Wood Carving", category: "Wood carving" }
      ],
      // sortByOptions: [
      //   {
      //     text: "Recently Added",
      //     value: "recent",
      //   },
      //   {
      //     text: "Price: Low To High",
      //     value: "price",
      //   },
      //   {
      //     text: "Price: High To Low",
      //     value: "-price",
      //   },
      // ],
      generalProductPrices: [],
      products: []
    };
  },
  computed: {
    currentCategory() {
      return this.tabs[this.tabIndex].category;
    }
  },
  methods: {
    getProducts: async function(category, pageNumber) {
      // console.log(category);
      let res = await this.$http.get(
        `/products?productCategories=${category}&page=${pageNumber}&limit=${this.elementsPerPage}`
      );
      // console.log(res);
      this.pagesCount = Math.ceil(res.data.totalSize / this.elementsPerPage);
      this.productsCount = res.data.size;

      this.products = res.data.products;
      // console.log(this.products);
      let generalProductPrices;
      if (
        Object.keys(this.$store.getters.nonCustomGeneralProducts).length === 0
      ) {
        res = await this.$http.get(`/general-products/non-custom-products`);

        this.$store.dispatch("setNonCustomGeneralProducts", res.data.products);

        const generalProductIndex = res.data.products.findIndex(
          product => product.productName === category
        );
        generalProductPrices = Object.values(
          res.data.products[generalProductIndex].sizesPrices
        );
      } else {
        generalProductPrices = Object.values(
          this.$store.getters.nonCustomGeneralProducts[category].sizesPrices
        );
      }
      this.generalProductPrices = generalProductPrices;
      this.page = pageNumber;
    }
  },
  mounted: async function() {
    //default tab is decoration tableaus
    await this.getProducts("Decoration tableau", this.page);
    this.dataFetched = true;
  }
};
</script>

<style scoped>
h2 {
  font-family: "Advent Pro";
  font-size: 30px;
  font-weight: bolder;
}
.main {
  background-image: url("~@/assets/sketch-texture.jpg") !important;
  background-repeat: repeat;
  background-size: 400px 400px;
  background-color: black !important;
  border-radius: 10px !important;
}
.productLink {
  text-decoration: none !important;
}

.productLink:hover {
  opacity: 0.7;
  transition: linear 0.3s;
  text-decoration: underline !important;
}
</style>
