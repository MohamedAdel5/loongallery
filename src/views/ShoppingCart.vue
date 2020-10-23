<template>
  <v-container>
    <v-card class="main mb-16">
      <v-container>
        <v-row>
          <v-col cols="12" class="d-flex justify-start pb-0">
            <v-btn @click="goBack" max-width="200px" color="secondary"
              >Go Back</v-btn
            >
          </v-col>
        </v-row>
        <v-card-title
          class="cart-card-title d-block text-center secondary--text"
          >Your Shopping Cart</v-card-title
        >
        <v-row>
          <v-col cols="12" class="secondary--text pb-0">
            <h3 class="font-weight-regular">Products</h3>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="py-0">
            <p v-if="cartIsEmpty">Your Cart Is Empty</p>
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
                              Remove From Cart
                              <v-icon>mdi-delete</v-icon>
                            </v-btn>
                          </td>
                        </tr>
                        <template v-if="!isCustomProduct(product)">
                          <tr>
                            <td>Product ID</td>
                            <td>{{ product.productID }}</td>
                          </tr>
                          <tr>
                            <td>Product Image</td>
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
                            <td>Size</td>
                            <td>{{ product.size }}</td>
                          </tr>
                          <tr>
                            <td>Quantity</td>
                            <td>{{ product.quantity }}</td>
                          </tr>
                          <tr>
                            <td>Number of people/faces</td>
                            <td>{{ product.numberOfFaces }}</td>
                          </tr>
                          <tr>
                            <td>Product Categories</td>

                            <td>
                              <tr
                                v-for="category in product.productCategories"
                                :key="category"
                              >
                                {{
                                  category
                                }}
                              </tr>
                            </td>
                          </tr>
                          <tr>
                            <td>Price</td>
                            <td>{{ product.price }}</td>
                          </tr>
                        </template>
                        <template v-else>
                          <v-chip small color="yellow" width="100"
                            >Custom Order</v-chip
                          >
                          <tr>
                            <td>Size</td>
                            <td>{{ product.size }}</td>
                          </tr>
                          <tr>
                            <td>Quantity</td>
                            <td>{{ product.quantity }}</td>
                          </tr>
                          <tr>
                            <td>Number of people/faces</td>
                            <td>{{ product.numberOfFaces }}</td>
                          </tr>
                          <tr>
                            <td>Product Categories</td>

                            <td>
                              <tr
                                v-for="category in product.productCategories"
                                :key="category"
                              >
                                {{
                                  category
                                }}
                              </tr>
                            </td>
                          </tr>
                          <tr>
                            <td>Price</td>
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
              <b class="secondary--text">Total Price: </b>
              <span>{{ totalPrice }} LE + Shipping Fees</span>
            </v-col>
          </v-row>
          <v-divider class="my-10"></v-divider>
          <v-row>
            <v-col cols="12" class="secondary--text pb-0">
              <h2 class="text-center secondary--text">Order Now</h2>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="secondary--text pb-0">
              <h3 class="font-weight-regular">Your Info</h3>
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

        <v-alert type="success" v-if="orderedSuccessfully === 'success'"
          >Your order is sent successfully. We will contact you as soon as
          possible</v-alert
        >
        <v-alert type="error" v-if="orderedSuccessfully === 'fail'"
          >There was an error sending your order. Please try again.</v-alert
        >
        <v-row>
          <v-col cols="12" class="d-flex justify-end pt-16 pb-0">
            <v-btn @click="goBack" max-width="200px" color="secondary"
              >Go Back</v-btn
            >
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import OrderInfo from "../components/OrderInfo";

export default {
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
      imageSize: 100,
      orderedSuccessfully: "none"
    };
  },
  methods: {
    removeFromCart: function(index) {
      this.$store.dispatch("removeFromCart", index);
    },
    isCustomProduct: product => {
      if (product.productCategories.includes("Custom")) return true;
      else return false;
    },
    goBack: function() {
      this.$router.go(-1);
    }
  },
  mounted() {}
};
</script>
<style scoped>
.main {
  background-image: url("~@/assets/sketch-texture.jpg") !important;
  background-repeat: repeat;
  background-size: 600px 600px;
  background-color: black !important;
  border-radius: 10px !important;
}
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
.image-class {
  border: 1px solid grey;
  border-radius: 5px;
}
</style>
