<template>
  <v-card v-if="dataFetched" class="main mb-16">
    <h2 class="text-center py-10 secondary--text">Orders</h2>
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
                    Total unseen orders
                  </td>
                  <td>
                    {{ unseenCount }}
                  </td>
                </tr>
                <tr>
                  <td>
                    Total seen orders:
                  </td>
                  <td>
                    {{ totalCount - unseenCount }}
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
              getOrders(page, 'admin');
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
        @click="handleSeen(order)"
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title
              v-text="`Order: ${order.code}`"
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

              <v-chip v-if="order.seen" small color="blue" width="100"
                >Seen</v-chip
              >
              <v-btn
                class="black red--text"
                @click="
                  showDeleteAssertionWindow = true;
                  orderToDeleteIndex = i;
                "
                small
              >
                Delete Order
                <v-icon>mdi-delete</v-icon>
              </v-btn>
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
                      {{ orderShippingMethod(order) }}
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
                                <td>Product Category</td>

                                <td>
                                  {{ product.generalProduct.productName }}
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
                                <td>Product Category</td>
                                <td>
                                  {{ product.generalProduct.productName }}
                                </td>
                              </tr>
                              <tr>
                                <td>Price</td>
                                <td>{{ product.price }}</td>
                              </tr>
                            </template>
                          </tbody>
                        </v-simple-table>
                      </tr>
                    </td>
                  </tr>
                  <tr>
                    <td>User</td>
                    <td>
                      <span v-if="order.userID">
                        User is registered in our system with ID:
                        {{ order.userID }}</span
                      >
                      <span v-else> User is not registered in our system</span>
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
            <v-btn
              color="success"
              small
              @click="handleDelivered(order)"
              v-if="!order.delivered"
              >Mark As delivered</v-btn
            >
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
    <v-overlay
      z-index="11"
      opacity="0.8"
      v-if="showDeleteAssertionWindow"
      :value="true"
    >
      <div class="my-10" v-click-outside="closeDeleteAssertionWindow">
        <v-btn icon @click="closeDeleteAssertionWindow">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <template v-if="deletedSuccessfully === 'none'">
          <p>Are you sure you want to delete this order?</p>
          <v-row>
            <v-col cols="4">
              <v-btn color="error" @click="showDeleteAssertionWindow = false">
                No
              </v-btn>
            </v-col>
            <v-col cols="4"></v-col>
            <v-col cols="4">
              <v-btn color="success" @click="deleteOrderSubmit()">
                Yes
              </v-btn>
            </v-col>
          </v-row>
        </template>
        <v-alert type="error" v-if="deletedSuccessfully === 'fail'"
          >Error. order cannot be deleted. Please try again.</v-alert
        >
        <v-alert type="success" v-if="deletedSuccessfully === 'success'"
          >Deleted successfully.</v-alert
        >
      </div>
    </v-overlay>
    <v-overlay z-index="11" opacity="0.8" v-if="showSeenError" :value="true">
      <div class="my-10" v-click-outside="closeSeenErrorWindow">
        <v-btn icon @click="closeSeenErrorWindow">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-alert type="error"
          >Error. Could not set seen status. Please try again.</v-alert
        >
      </div>
    </v-overlay>
    <v-overlay
      z-index="11"
      opacity="0.8"
      v-if="showDeliveredError"
      :value="true"
    >
      <div class="my-10" v-click-outside="closeDeliveredErrorWindow">
        <v-btn icon @click="closeDeliveredErrorWindow">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-alert type="error"
          >Error. Could not set delivered status. Please try again.</v-alert
        >
      </div>
    </v-overlay>
  </v-card>
</template>

<script>
import ordersMixin from "@/mixins/ordersMixin.js";
import {
  setSeenMixin,
  setDeliveredMixin,
  deleteOrderMixin
} from "@/mixins/apiMixins";
export default {
  name: "admin-orders",
  mixins: [ordersMixin, setSeenMixin, setDeliveredMixin, deleteOrderMixin],
  data() {
    return {
      deletedSuccessfully: "none",
      showDeleteAssertionWindow: false,
      orderToDeleteIndex: null,
      showSeenError: false,
      showDeliveredError: false
    };
  },
  methods: {
    handleSeen: async function(order) {
      //Check if the request went well then set the seen status here
      this.showSeenError = !(await this.setSeen(order._id));
      if (!this.showSeenError) {
        order.seen = true;
        this.unseenCount -= 1;
      }
    },
    handleDelivered: async function(order) {
      //Check if the request went well then set the delivered status here
      this.showDeliveredError = !(await this.setDelivered(order._id));
      if (!this.showDeliveredError) {
        order.delivered = true;
        this.undeliveredCount -= 1;
      }
    },
    deleteOrderSubmit: async function() {
      this.deletedSuccessfully = (await this.deleteOrder(
        this.orders[this.orderToDeleteIndex]._id
      ))
        ? "success"
        : "fail";
      if (this.deletedSuccessfully == "success") {
        await this.getOrders(1, "admin");
      }
      this.orderToDeleteIndex = null;
    },
    closeDeleteAssertionWindow: function() {
      this.showDeleteAssertionWindow = false;
      this.deletedSuccessfully = "none";
    },
    closeSeenErrorWindow: function() {
      this.showSeenError = false;
    },
    closeDeliveredErrorWindow: function() {
      this.showDeliveredError = false;
    }
  }
};
</script>

<style scoped>
td {
  padding: 2px;
}
</style>
