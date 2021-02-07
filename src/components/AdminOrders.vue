<template>
  <v-card v-if="dataFetched" class="main mb-16">
    <h2 class="text-center py-10 secondary--text">{{ $t("orders") }}</h2>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-simple-table dense dark>
            <template v-slot:default>
              <tbody>
                <tr>
                  <td>
                    {{ $t("total_orders") }}
                  </td>
                  <td>
                    {{ totalCount }}
                  </td>
                </tr>
                <tr>
                  <td>
                    {{ $t("total_unseen") }}
                  </td>
                  <td>
                    {{ unseenCount }}
                  </td>
                </tr>
                <tr>
                  <td>
                    {{ $t("total_seen") }}
                  </td>
                  <td>
                    {{ totalCount - unseenCount }}
                  </td>
                </tr>
                <tr>
                  <td>
                    {{ $t("total_undelivered") }}
                  </td>
                  <td>
                    {{ undeliveredCount }}
                  </td>
                </tr>
                <tr>
                  <td>
                    {{ $t("total_in_transit") }}
                  </td>
                  <td>
                    {{ inTransitCount }}
                  </td>
                </tr>
                <tr>
                  <td>
                    {{ $t("total_undelivered") }}
                  </td>
                  <td>
                    {{
                      totalCount -
                        undeliveredCount -
                        rejectedCount -
                        inTransitCount
                    }}
                  </td>
                </tr>
                <tr>
                  <td>
                    {{ $t("total_rejected") }}
                  </td>
                  <td>
                    {{ rejectedCount }}
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
      </v-row>
      <v-row class="my-0">
        <v-col cols="12" class="my-0">
          <p class="font-weight-light subtitle-2 my-0">
            {{ $t("search_for_order") }}:
          </p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" class="my-0">
          <v-text-field
            append-icon="mdi-magnify"
            solo
            dense
            v-model="searchOrderCode"
            :label="$t('write_order_code')"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-btn color="secondary" @click="searchOrderSubmit">{{
            $t("search")
          }}</v-btn>
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
    <v-list class="main" v-if="orders.length > 0">
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
              <v-chip
                v-if="order.deliveredStatus"
                small
                color="secondary"
                width="100"
                >{{ $t(order.deliveredStatus) }}</v-chip
              >
              <v-chip
                v-if="hasACustomOrder(order)"
                small
                color="yellow"
                width="100"
                >{{ $t("has_custom_order") }}</v-chip
              >

              <v-chip v-if="order.seen" small color="blue" width="100">{{
                $t("seen")
              }}</v-chip>
              <v-btn
                class="black red--text"
                @click="
                  showDeleteAssertionWindow = true;
                  orderToDeleteIndex = i;
                "
                small
                v-if="myAuthority === 'primary'"
              >
                {{ $t("remove") }}
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
                    <td>{{ $t("order_code") }}</td>
                    <td>
                      {{ order.code }}
                    </td>
                  </tr>
                  <tr>
                    <td>{{ $t("date") }}</td>
                    <td>
                      {{ new Date(order.date).toString() }}
                    </td>
                  </tr>
                  <tr>
                    <td>{{ $t("name") }}</td>
                    <td>
                      {{ order.customerName }}
                    </td>
                  </tr>
                  <tr>
                    <td>{{ $t("shipping_method") }}</td>
                    <td>
                      {{ orderShippingMethod(order) }}
                    </td>
                  </tr>
                  <tr>
                    <td>{{ $t("address") }}</td>
                    <td>
                      {{ order.customerAddress }}
                    </td>
                  </tr>
                  <tr>
                    <td>{{ $t("phone_number") }}</td>
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
                    <td>{{ $t("products") }}</td>
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
                                <td class="ltr_dir">{{ product.size }}</td>
                              </tr>
                              <tr>
                                <td>{{ $t("product_category") }}</td>
                                <td>
                                  {{ getProductCategoryName(product) }}
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
                            <template v-else>
                              <v-chip small color="yellow" width="100">{{
                                $t("custom_order")
                              }}</v-chip>
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
                                <td class="ltr_dir">{{ product.size }}</td>
                              </tr>
                              <tr>
                                <td>{{ $t("number_of_faces") }}</td>
                                <td>{{ product.numberOfFaces }}</td>
                              </tr>
                              <tr>
                                <td>{{ $t("product_category") }}</td>
                                <td>
                                  {{ getProductCategoryName(product) }}
                                </td>
                              </tr>
                              <tr>
                                <td>{{ $t("order_note") }}</td>
                                <td>
                                  {{ product.otherNotes }}
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
                      </tr>
                    </td>
                  </tr>
                  <tr>
                    <td>{{ $t("user") }}</td>
                    <td>
                      <span v-if="order.userID">
                        {{ $t("user_id_note1") }}: {{ order.userID }}</span
                      >
                      <span v-else> {{ $t("user_id_note2") }}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>{{ $t("shipping_fees") }}</td>
                    <td>
                      {{ order.shippingFees }}
                    </td>
                  </tr>
                  <tr>
                    <td>{{ $t("total_price") }}</td>
                    <td>
                      {{ totalPrice(i) }}
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <template
              v-if="myAuthority === 'manager' || myAuthority === 'primary'"
            >
              <v-btn
                color="success"
                small
                @click="handleDelivered(order, 'delivered')"
                :disabled="order.deliveredStatus === 'delivered'"
                >{{ $t("mark_as_delivered") }}</v-btn
              ><br />
              <v-btn
                color="secondary"
                small
                @click="handleDelivered(order, 'in transit')"
                :disabled="order.deliveredStatus === 'in transit'"
                >{{ $t("mark_as_in_transit") }}</v-btn
              ><br />
              <v-btn
                color="error"
                small
                @click="handleDelivered(order, 'rejected')"
                :disabled="order.deliveredStatus === 'rejected'"
                >{{ $t("mark_as_rejected") }}</v-btn
              ><br />
            </template>
            <template v-if="myAuthority === 'designer'">
              <v-btn
                color="success"
                small
                @click="handleDone(order)"
                :disabled="order.designerDone"
                >{{ $t("mark_as_done") }}</v-btn
              >
            </template>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>

    <p class="pa-4" v-else>{{ $t("no_orders_found") }}</p>
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
          <p>{{ $t("delete_consent") }}</p>
          <v-row>
            <v-col cols="4">
              <v-btn color="error" @click="showDeleteAssertionWindow = false">
                {{ $t("no") }}
              </v-btn>
            </v-col>
            <v-col cols="4"></v-col>
            <v-col cols="4">
              <v-btn color="success" @click="deleteOrderSubmit()">
                {{ $t("yes") }}
              </v-btn>
            </v-col>
          </v-row>
        </template>
        <v-alert type="error" v-if="deletedSuccessfully === 'fail'">{{
          $t("delete_fail")
        }}</v-alert>
        <v-alert type="success" v-if="deletedSuccessfully === 'success'">{{
          $t("delete_success")
        }}</v-alert>
      </div>
    </v-overlay>
    <v-overlay z-index="11" opacity="0.8" v-if="showSeenError" :value="true">
      <div class="my-10" v-click-outside="closeSeenErrorWindow">
        <v-btn icon @click="closeSeenErrorWindow">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-alert type="error">{{ $t("seen_err") }}</v-alert>
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
        <v-alert type="error">{{ $t("delivered_err") }}</v-alert>
      </div>
    </v-overlay>
  </v-card>
</template>

<script>
import ordersMixin from "@/mixins/ordersMixin.js";
import {
  setSeenMixin,
  setDeliveredMixin,
  deleteOrderMixin,
  setDesignerDoneMixin
} from "@/mixins/apiMixins";
export default {
  name: "admin-orders",
  mixins: [
    ordersMixin,
    setSeenMixin,
    setDeliveredMixin,
    deleteOrderMixin,
    setDesignerDoneMixin
  ],
  data() {
    return {
      deletedSuccessfully: "none",
      showDeleteAssertionWindow: false,
      orderToDeleteIndex: null,
      showSeenError: false,
      showDeliveredError: false
    };
  },
  computed: {
    myAuthority() {
      return this.$store.getters.admin.authority;
    }
  },
  methods: {
    handleSeen: async function(order) {
      if (this.myAuthority !== "manager") return;
      //Check if the request went well then set the seen status here
      if (order.seen) return;
      this.showSeenError = !(await this.setSeen(order._id));
      if (!this.showSeenError) {
        order.seen = true;
        this.unseenCount -= 1;
      }
    },
    handleDelivered: async function(order, status) {
      //Check if the request went well then set the delivered status here
      this.showDeliveredError = !(await this.setDelivered(order._id, status));
      if (!this.showDeliveredError) {
        order.deliveredStatus = status;
        this.undeliveredCount -= 1;
      }
    },
    handleDone: async function(order) {
      //Check if the request went well then set the delivered status here
      this.showDeliveredError = !(await this.setDesignerDone(order._id));
      order.designerDone = true;
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
