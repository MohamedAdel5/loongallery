<template>
  <v-container v-if="dataFetched">
    <v-card class="main mb-16">
      <v-container>
        <v-row>
          <v-col cols="12" class="d-flex justify-start pb-0">
            <v-btn @click="goBack" max-width="200px" color="secondary">{{
              $t("back")
            }}</v-btn>
          </v-col>
        </v-row>
        <v-card-title
          class="cart-card-title d-block text-center secondary--text"
          >{{ $t("your_shopping_cart") }}</v-card-title
        >
        <v-row>
          <v-col cols="12" class="secondary--text pb-0">
            <h3 class="font-weight-regular">{{ $t("products") }}</h3>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="py-0">
            <p v-if="cartIsEmpty">{{ $t("cart_empty") }}</p>
            <v-simple-table light class="table-class pa-2">
              <template v-slot:default>
                <tbody>
                  <tr v-for="(product, i) in cart" :key="i">
                    <v-simple-table class="table-class">
                      <tbody>
                        <tr>
                          <td>
                            <h3>[{{ i + 1 }}]</h3>
                          </td>
                          <td>
                            <v-btn
                              class="black red--text"
                              @click="removeFromCart(i)"
                              small
                            >
                              {{ $t("remove_from_cart") }}
                              <v-icon>mdi-delete</v-icon>
                            </v-btn>
                          </td>
                        </tr>
                        <template v-if="!isCustomProduct(product)">
                          <tr>
                            <td>{{ $t("sku_code") }}</td>
                            <td>{{ product.skuCode }}</td>
                          </tr>
                          <tr>
                            <td>{{ $t("product_image") }}</td>
                            <td>
                              <a :href="product.image" target="_blank">
                                <v-img
                                  :src="product.image"
                                  :height="imageSize"
                                  :width="imageSize"
                                  class="image-class"
                                ></v-img>
                              </a>
                            </td>
                          </tr>
                          <tr>
                            <td>{{ $t("size") }}</td>
                            <td
                              :class="
                                $root.$i18n.locale == 'ar' ? 'ltr_dir' : ''
                              "
                            >
                              {{ product.size }}
                            </td>
                          </tr>
                          <tr>
                            <td>{{ $t("quantity") }}</td>
                            <td>{{ product.quantity }}</td>
                          </tr>
                          <tr>
                            <td>{{ $t("product_category") }}</td>

                            <td>{{ getProductCategory(product) }}</td>
                          </tr>
                          <tr>
                            <td>{{ $t("price") }}</td>
                            <td>{{ product.price }}</td>
                          </tr>
                        </template>
                        <template v-else>
                          <v-chip small color="yellow" width="100">{{
                            $t("custom_order")
                          }}</v-chip>
                          <tr>
                            <td>{{ $t("size") }}</td>
                            <td class="ltr_dir">{{ product.size }}</td>
                          </tr>
                          <tr>
                            <td>{{ $t("order_note") }}</td>
                            <td>
                              {{ product.otherNotes }}
                            </td>
                          </tr>
                          <tr>
                            <td>{{ $t("number_of_faces") }}</td>
                            <td>{{ product.numberOfFaces }}</td>
                          </tr>
                          <tr>
                            <td>{{ $t("product_category") }}</td>

                            <td>
                              {{ getProductCategory(product) }}
                            </td>
                          </tr>
                          <tr>
                            <td>{{ $t("quantity") }}</td>
                            <td>{{ product.quantity }}</td>
                          </tr>
                          <tr>
                            <td>{{ $t("price") }}</td>
                            <td>{{ product.price }}</td>
                          </tr>
                        </template>
                      </tbody>
                    </v-simple-table>
                    <v-divider v-for="i in 10" :key="i"></v-divider>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
        </v-row>
        <template v-if="!cartIsEmpty && orderedSuccessfully === 'none'">
          <v-row>
            <v-col cols="12">
              <b class="secondary--text">{{ $t("total_price") }}: </b>
              <span>{{ totalPrice }} LE </span><br />
              <span>+ {{ $t("shipping_fees") }}</span
              ><br />
              <span class="caption">{{ $t("shipping_fees_note") }}</span>
            </v-col>
          </v-row>
          <v-divider class="my-10"></v-divider>
          <v-row>
            <v-col cols="12" class="secondary--text pb-0">
              <h2 class="text-center secondary--text">{{ $t("order_now") }}</h2>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="secondary--text pb-0">
              <h3 class="font-weight-regular">{{ $t("your_info") }}</h3>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="py-0">
              <order-info
                v-on:ordered-successfully="orderedSuccessfully = $event"
              ></order-info>
            </v-col>
          </v-row>
        </template>

        <v-alert type="success" v-if="orderedSuccessfully === 'success'">{{
          $t("order_success")
        }}</v-alert>
        <v-alert type="error" v-if="orderedSuccessfully === 'fail'">{{
          $t("order_fail")
        }}</v-alert>
        <v-row>
          <v-col cols="12" class="d-flex justify-end pt-16 pb-0">
            <v-btn @click="goBack" max-width="200px" color="secondary">{{
              $t("back")
            }}</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import OrderInfo from "../components/OrderInfo";
import {
  setCustomGeneralProductsMixin,
  setNonCustomGeneralProductsMixin
} from "@/mixins/apiMixins";

export default {
  name: "shopping-cart",
  mixins: [setCustomGeneralProductsMixin, setNonCustomGeneralProductsMixin],
  components: {
    OrderInfo
  },
  computed: {
    cart() {
      return this.$store.getters.cart;
    },
    cartIsEmpty() {
      return this.$store.getters.cart.length === 0;
    },
    totalPrice() {
      let total = 0;
      this.$store.getters.cart.forEach(product => {
        total += product.price;
      });
      return total;
    }
  },
  data() {
    return {
      dataFetched: false,
      imageSize: process.env.VUE_APP_CART_IMAGE_SIZE,
      orderedSuccessfully: "none"
    };
  },
  methods: {
    removeFromCart: function(index) {
      this.$store.dispatch("removeFromCart", index);
    },
    isCustomProduct: function(product) {
      let customGeneralProducts = this.$store.getters.customGeneralProducts;
      let keys = Object.keys(customGeneralProducts);

      for (let key of keys) {
        if (customGeneralProducts[key].id === product.generalProduct)
          return true;
      }
      return false;
    },
    getProductCategory(product) {
      let customGeneralProducts = this.$store.getters.customGeneralProducts;
      let nonCustomGeneralProducts = this.$store.getters
        .nonCustomGeneralProducts;

      let keys = Object.keys(customGeneralProducts);
      for (let key of keys) {
        if (customGeneralProducts[key].id === product.generalProduct)
          return this.$root.$i18n.locale === "en"
            ? key
            : customGeneralProducts[key].productName_Ar;
      }
      keys = Object.keys(nonCustomGeneralProducts);
      for (let key of keys) {
        if (nonCustomGeneralProducts[key].id === product.generalProduct)
          return this.$root.$i18n.locale === "en"
            ? key
            : nonCustomGeneralProducts[key].productName_Ar;
      }
      return "";
    },
    goBack: function() {
      this.$router.go(-1);
    }
  },
  mounted: async function() {
    await this.setCustomGeneralProducts();
    await this.setNonCustomGeneralProducts();
    this.dataFetched = true;
  }
};
</script>
<style scoped>
.cart-card-title,
h2 {
  font-family: "Advent Pro";
  font-size: 30px;
  font-weight: bolder;
  white-space: pre-wrap;
  word-break: normal;
}
td {
  padding: 4px;
}
.table-class {
  background-color: transparent !important;
}
</style>
