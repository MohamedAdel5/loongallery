<template>
  <v-card flat class="main mb-16" v-if="dataFetched">
    <h2 class="text-center pt-10 secondary--text">{{ $t("our_products") }}</h2>
    <v-container class="d-flex flex-column align-content-space-around pt-0">
      <v-row style="color: rgba(50, 46, 46, 0.87)">
        <v-container class="pt-0">
          <p class="text-center caption">
            <a href="#productsDetails" class="brown--text">
              {{ $t("products_details") }}
            </a>
          </p>
        </v-container>
      </v-row>
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
          {{ itemTitle(item) }}
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
                `${itemTitle(tabs[tabIndex])}-${
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
                `${itemTitle(tabs[tabIndex])}-${
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
      <v-divider></v-divider>
      <v-row
        style="border: solid 1px grey; border-radius: 5px"
        class="mx-2 mt-6"
      >
        <v-container id="productsDetails" class="pa-2">
          <non-custom-products-details />
        </v-container>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import ProductCard from "./ProductCard";
import NonCustomProductsDetails from "./NonCustomProductsDetails";

import productsMixin from "@/mixins/productsMixin";

export default {
  name: "our-products",
  mixins: [productsMixin],
  components: {
    ProductCard,
    NonCustomProductsDetails
  },
  watch: {},
  data() {
    return {};
  },
  computed: {},
  methods: {
    itemTitle(item) {
      if (this.$root.$i18n.locale === "en") return item.title;
      else return item.title_ar;
    }
  }
};
</script>

<style scoped>
h2 {
  font-family: "Advent Pro";
  font-size: 30px;
  font-weight: bolder;
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
