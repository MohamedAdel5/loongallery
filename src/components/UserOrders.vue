<template>
  <v-card v-if="dataFetched" class="main mb-16">
    <v-card-title class="d-block text-center secondary--text h1"
      >My Orders</v-card-title
    >
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-simple-table dense dark>
            <template v-slot:default>
              <tbody>
                <tr>
                  <td>
                    Total orders
                  </td>
                  <td>
                    {{ totalCount }}
                  </td>
                </tr>
                <tr>
                  <td>
                    Total undelivered orders:
                  </td>
                  <td>
                    {{ undeliveredCount }}
                  </td>
                </tr>
                <tr>
                  <td>
                    Total delivered orders:
                  </td>
                  <td>
                    {{ totalCount - undeliveredCount }}
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-pagination
            v-model="page"
            :length="pagesCount"
            :total-visible="$vuetify.breakpoint.smAndDown ? 3 : pagesCount"
            circle
            color="secondary"
            dark
            @input="
              getOrders(page);
              disableAllLists();
            "
          >
          </v-pagination>
        </v-col>
      </v-row>
    </v-container>
    <v-list class="main">
      <v-list-group
        dark
        v-for="(order, i) in orders"
        :key="order._id"
        v-model="ordersListsEnable[i]"
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title
              v-text="`Order: ${(page - 1) * elementsPerPage + (i + 1)}`"
            ></v-list-item-title>
            <div class="text-right">
              <v-chip v-if="order.delivered" small color="success" width="100"
                >Delivered</v-chip
              >
              <v-chip
                v-if="hasACustomOrder(order)"
                small
                color="yellow"
                width="100"
                >Has Custom Order(s)</v-chip
              >
            </div>
          </v-list-item-content>
        </template>
        <v-list-item>
          <v-list-item-content>
            <v-simple-table>
              <template v-slot:default>
                <tbody>
                  <tr>
                    <td>Order code</td>
                    <td>
                      {{ order.code }}
                    </td>
                  </tr>
                  <tr>
                    <td>Date</td>
                    <td>
                      {{ new Date(order.date).toString() }}
                    </td>
                  </tr>
                  <tr>
                    <td>Name</td>
                    <td>
                      {{ order.customerName }}
                    </td>
                  </tr>
                  <tr>
                    <td>Shipping Method</td>
                    <td>
                      {{ order.shippingMethod }}
                    </td>
                  </tr>
                  <tr>
                    <td>Address</td>
                    <td>
                      {{ order.customerAddress }}
                    </td>
                  </tr>
                  <tr>
                    <td>Phone Numbers</td>
                    <td>
                      <tr
                        v-for="phone in order.customerPhoneNumbers"
                        :key="phone"
                      >
                        {{
                          phone
                        }}
                      </tr>
                    </td>
                  </tr>
                  <tr>
                    <td>Products</td>
                    <td>
                      <tr
                        v-for="(product, j) in order.products"
                        :key="j"
                        class="d-block"
                      >
                        <v-simple-table>
                          <tbody>
                            <tr>
                              <td>
                                <h3>[{{ j + 1 }}]</h3>
                              </td>
                              <td></td>
                            </tr>
                            <template v-if="!isCustomProduct(product)">
                              <tr>
                                <td>Product SKU code</td>
                                <td>{{ product.skuCode }}</td>
                              </tr>
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
                                <td>Number of people/faces</td>
                                <td>{{ product.numberOfFaces }}</td>
                              </tr>
                              <tr>
                                <td>Quantity</td>
                                <td>{{ product.quantity }}</td>
                              </tr>
                              <tr>
                                <td>Price</td>
                                <td>{{ product.price }}</td>
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
                            </template>
                            <template v-else>
                              <v-chip small color="yellow" width="100"
                                >Custom Order</v-chip
                              >
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
                                <td>Number of people/faces</td>
                                <td>{{ product.numberOfFaces }}</td>
                              </tr>
                              <tr>
                                <td>Quantity</td>
                                <td>{{ product.quantity }}</td>
                              </tr>
                              <tr>
                                <td>Price</td>
                                <td>{{ product.price }}</td>
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
                            </template>
                          </tbody>
                        </v-simple-table>
                      </tr>
                    </td>
                  </tr>
                  <tr>
                    <td>Shipping Fees</td>
                    <td>
                      {{ order.shippingFees }}
                    </td>
                  </tr>
                  <tr>
                    <td>Total price</td>
                    <td>
                      {{ totalPrice(i) }}
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-card>
</template>

<script>
export default {
  name: "user-orders",
  data() {
    return {
      dataFetched: false,
      page: 1,
      elementsPerPage: process.env.VUE_APP_PRODUCTS_ELEMENTS_PER_PAGE,
      pagesCount: null,
      totalCount: null,
      ordersCount: null,
      undeliveredCount: null,
      ordersListsEnable: undefined,
      orders: [],
      imageSize: 200
    };
  },
  beforeMount() {
    this.ordersListsEnable = new Array(this.orders.length);
    for (let i of this.ordersListsEnable) {
      this.ordersListsEnable[i] = false;
    }
  },
  methods: {
    totalPrice(index) {
      let totalPrice = 0;
      this.orders[index].products.forEach(product => {
        totalPrice += product.price;
      });
      return totalPrice + this.orders[index].shippingFees;
    },
    hasACustomOrder: order => {
      for (let i = 0; i < order.products.length; i++) {
        if (order.products[i].productCategories.includes("Custom")) return true;
      }
      return false;
    },
    isCustomProduct: product => {
      if (product.productCategories.includes("Custom")) return true;
      else return false;
    },
    getOrders: async function(pageNumber) {
      let res = await this.$http.get(
        `/users/me/orders?sort=-date&page=${pageNumber}&limit=${this.elementsPerPage}`,
        {
          headers: { Authorization: this.$store.getters.authJwt }
        }
      );
      // console.log(res);
      this.pagesCount = Math.ceil(res.data.totalSize / this.elementsPerPage);
      this.totalCount = res.data.totalSize;
      this.ordersCount = res.data.size;
      this.undeliveredCount = res.data.totalUndelivered;

      this.orders = res.data.orders;

      this.page = pageNumber;
    },
    disableAllLists: function() {
      for (let i = 0; i < this.ordersListsEnable.length; i++) {
        this.ordersListsEnable[i] = false;
      }
    }
  },
  mounted: async function() {
    //default tab is decoration tableaus
    await this.getOrders(this.page);
    this.ordersListsEnable = new Array(this.orders.length);
    this.disableAllLists();
    this.dataFetched = true;
  }
};
</script>

<style scoped>
.main {
  background-image: url("~@/assets/sketch-texture.png") !important;
  background-repeat: repeat;
  background-size: 600px 600px;
  background-color: black !important;
  border-radius: 10px !important;
}
td {
  padding: 2px;
}
.image-class {
  border: 1px solid grey;
  border-radius: 5px;
}
</style>
