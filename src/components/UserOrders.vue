<template>
  <v-card v-if="dataFetched" class="main mb-16">
    <v-card-title class="d-block text-center secondary--text h1">{{
      $t("my_orders")
    }}</v-card-title>
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
                    {{ $t("total_undelivered") }}
                  </td>
                  <td>
                    {{ undeliveredCount }}
                  </td>
                </tr>
                <tr>
                  <td>
                    {{ $t("total_delivered") }}
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
              getOrders(page, 'user');
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
              <v-chip
                v-if="order.delivered"
                small
                color="success"
                width="100"
                >{{ $t("delivered") }}</v-chip
              >
              <v-chip
                v-if="hasACustomOrder(order)"
                small
                color="yellow"
                width="100"
                >{{ $t("has_custom_order") }}</v-chip
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
                                <td>{{ $t("quantity") }}</td>
                                <td>{{ product.quantity }}</td>
                              </tr>
                              <tr>
                                <td>{{ $t("product_category") }}</td>

                                <td>
                                  {{ getProductCategoryName(product) }}
                                </td>
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
                                <td>{{ $t("quantity") }}</td>
                                <td>{{ product.quantity }}</td>
                              </tr>
                              <tr>
                                <td>{{ $t("product_category") }}</td>
                                <td>
                                  {{ getProductCategoryName(product) }}
                                </td>
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
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-card>
</template>

<script>
import ordersMixin from "@/mixins/ordersMixin.js";

export default {
  name: "user-orders",
  mixins: [ordersMixin],

  data() {
    return {};
  },
  beforeMount() {
    this.ordersListsEnable = new Array(this.orders.length);
    for (let i of this.ordersListsEnable) {
      this.ordersListsEnable[i] = false;
    }
  },
  methods: {}
};
</script>

<style scoped>
td {
  padding: 2px;
}
</style>
