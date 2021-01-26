<template>
  <v-card flat class="main mb-16" v-if="dataFetched">
    <h2 class="text-center pt-10 secondary--text">Our Products</h2>
    <v-container class="d-flex flex-column align-content-space-around pt-0">
      <v-row style="color: rgba(50, 46, 46, 0.87)">
        <v-container class="pt-0">
          <p class="text-center caption">
            <a href="#productsDetails" class="brown--text">
              Please read the section underneath this page to find details about
              our products materials and our delivery times.
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
      <v-divider></v-divider>
      <v-row
        style="border: solid 1px grey; border-radius: 5px"
        class="mx-2 mt-6"
      >
        <v-container id="productsDetails">
          <v-row>
            <v-col cols="12">
              <h3>Our products and their delivery times:</h3>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <h4>Decoration tableaus</h4>
              <ul>
                <li>
                  Material <br />
                  <ul>
                    <li>Printed on a 12mm MDF wood.</li>
                    <li>
                      Has two hangers on the back to be hanged either
                      horizontally or vertically.
                    </li>
                    <li>
                      Has an extra protection screen to protect it from water
                      and dust.
                    </li>
                    <li>Has a leather-like texture and can cleaned easily.</li>
                  </ul>
                </li>
                <li>
                  Delivery time <br />
                  <ul>
                    <li>Delivery to a home: 3-5 days</li>
                    <li>Delivery to a metro station: 2-3 days</li>
                    <li>Receive from our branch location: 2-3 days</li>
                  </ul>
                </li>
              </ul>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <h4>Mersal</h4>
              <ul>
                <li>
                  Material <br />
                  <ul>
                    <li>An envelope made of heavy paper(canson).</li>
                    <li>Watercolor drawing.</li>
                  </ul>
                </li>
                <li>
                  Delivery time <br />
                  <ul>
                    <li>Delivery to a home: within 7 days</li>
                    <li>Delivery to a metro station: within 7 days</li>
                    <li>Receive from our branch location: within 7 days</li>
                  </ul>
                </li>
              </ul>
            </v-col>
          </v-row>
        </v-container>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import ProductCard from "./ProductCard";
import productsMixin from "@/mixins/productsMixin";

export default {
  name: "our-products",
  mixins: [productsMixin],
  components: {
    ProductCard
  },
  watch: {},
  data() {
    return {};
  },
  computed: {},
  methods: {}
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
