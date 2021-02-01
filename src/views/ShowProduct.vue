<template>
  <v-container class="mb-16" v-if="dataFetched">
    <v-card class="main mb-16">
      <v-container>
        <v-form v-model="valid" ref="form">
          <v-row class="pa-2">
            <v-col cols="12" sm="6">
              <v-img
                :src="product.image"
                contain
                aspect-ratio="1"
                :max-width="imageSize"
                :max-height="imageSize"
                class="portrait"
              />
            </v-col>
            <v-col cols="12" sm="6" class="mt-10">
              <h2 class="font-weight-light mb-10">
                {{ productName(product) }}
              </h2>

              <v-row class="mt-4">
                <v-col cols="6" class="d-flex justify-left align-center pa-0">
                  <v-label
                    ><span class="dark--text caption">{{
                      $t("choose_size")
                    }}</span></v-label
                  >
                </v-col>
                <v-col
                  cols="6"
                  class="d-flex justify-center align-center sizeRow"
                >
                  <v-select
                    :disabled="!addToCartButton"
                    v-model="size"
                    :items="portraitSizes"
                    standard
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <router-link class=" blue--text" :to="'/preview-sizes'">{{
                  $t("preview_sizes")
                }}</router-link>
              </v-row>
              <v-row class="d-flex justify-left pt-6">
                <v-text-field
                  :disabled="!addToCartButton"
                  v-model="quantity"
                  min="1"
                  :rules="quantityRules"
                  type="number"
                  :label="$t('quantity')"
                  dense
                ></v-text-field>
              </v-row>
              <v-row class="mt-10">
                <v-col
                  cols="12"
                  class="d-flex justify-left align-center pa-0"
                  sm="6"
                >
                  <h4>{{ $t("price") }}: {{ price }} LE</h4>
                </v-col>
                <v-col cols="12" class="pa-0" sm="6">
                  <v-btn
                    v-if="addToCartButton"
                    @click="
                      addToCart();
                      hideAddToCart();
                    "
                    :disabled="!price"
                    max-width="200px"
                    color="success"
                    >{{ $t("add_to_cart") }} <v-icon>mdi-cart</v-icon></v-btn
                  >
                  <span v-if="!addToCartButton" class="secondary--text pr-2">{{
                    $t("product_added_to_cart")
                  }}</span>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" class="d-flex justify-end pt-16 pb-0">
                  <v-btn @click="goBack" max-width="200px" color="secondary">{{
                    $t("back")
                  }}</v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-form>
      </v-container>
    </v-card>
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
          <template v-else> <v-icon>mdi-cart</v-icon> </template>
        </v-btn>
      </template>
      <span v-if="productIsAdded">{{ $t("product_added_to_cart") }}</span>
      <span v-else>{{ $t("view_shopping_cart") }}</span>
    </v-tooltip>
  </v-container>
</template>

<script>
import {
  setOneProductMixin,
  setNonCustomGeneralProductsMixin
} from "@/mixins/apiMixins";

export default {
  name: "show-product",
  mixins: [setOneProductMixin, setNonCustomGeneralProductsMixin],
  data() {
    return {
      quantity: 1,
      imageSize: process.env.VUE_APP_PRODUCT_IMAGE_SIZE,
      showCartTooltip: false,
      productIsAdded: false,
      product: null,
      generalProductSizesPrices: null,
      size: "",
      quantityRules: [v => v >= 1 || "Quantity must be greater than 1"],
      addToCartButton: true,
      valid: false,
      dataFetched: false
    };
  },
  methods: {
    addToCart: function() {
      //Upload Image and get the link.
      //make an object contains the props {image, price, size, categories}
      this.$refs.form.validate();
      if (this.valid) {
        const product = {
          productID: this.product._id,
          skuCode: this.product.skuCode,
          image: this.product.image,
          // productCategories: this.product.productCategories,
          generalProduct: this.product.generalProduct._id,
          size: this.size,
          numberOfFaces: 0,
          quantity: this.quantity,
          price: this.price
        };
        this.$store.dispatch("addToCart", product);
        this.showProductAddedTooltip();
      }
    },
    hideAddToCart: function() {
      this.addToCartButton = false;
    },
    goBack: function() {
      this.$router.go(-1);
    },
    showProductAddedTooltip: function() {
      this.productIsAdded = true;
      this.showCartTooltip = true;
      setTimeout(() => {
        this.showCartTooltip = false;
        this.productIsAdded = false;
      }, 3000);
    },
    productName(product) {
      if (this.$root.$i18n.locale === "en")
        return product.generalProduct.productName;
      else return product.generalProduct.productName_Ar;
    }
  },
  computed: {
    portraitSizes() {
      return Object.keys(this.generalProductSizesPrices);
    },
    price() {
      if (this.valid && !this.size) return "";
      return this.generalProductSizesPrices[this.size] * this.quantity;
    }
  },
  created: async function() {
    //Send request to get the product of the given id this.$route.params.id
    this.product = await this.setOneProduct(this.$route.params.id);
    await this.setNonCustomGeneralProducts();

    const productCategory = this.product.generalProduct.productName;
    this.generalProductSizesPrices = this.$store.getters.nonCustomGeneralProducts[
      productCategory
    ].sizesPrices;

    this.dataFetched = true;
  }
};
</script>
<style scoped>
.sizeRow {
  max-height: 50px;
}
.portrait {
  border: solid 1px black;
}
.v-select-list,
.v-select {
  direction: ltr !important;
}
</style>
