<template>
  <v-card flat class="main" v-if="dataFetched">
    <h2 class="text-center py-10 secondary--text">{{ $t("our_products") }}</h2>
    <v-container class="d-flex flex-column align-content-space-around">
      <v-row class="d-flex flex-row">
        <v-col cols="3" sm="6" class="pl-4 d-flex flex-grow-0 flex-shrink-1">
          <v-btn class="success" small @click="showAddNewProductWindow = true">
            {{ $t("add_new_product") }}
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-col>
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
          <v-container class="pa-0">
            <v-row class="pa-0 mx-0">
              <v-col cols="5" class="pa-0">
                <v-btn
                  @click="
                    showDeleteAssertionWindow = true;
                    productToDeleteID =
                      products[(i - 1) * elementsPerRow + (j - 1)]._id;
                  "
                  class="red--text"
                >
                  {{ $t("remove") }}
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="2"></v-col>
              <v-col cols="5" class="pa-0">
                <v-btn
                  @click="
                    showEditProductWindow = true;
                    productToEdit =
                      products[(i - 1) * elementsPerRow + (j - 1)];
                  "
                  class="secondary--text"
                >
                  {{ $t("edit") }}
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
          <product-card
            :prices="generalProductPrices"
            :title="
              `${itemTitle(tabs[tabIndex])}-${
                products[(i - 1) * elementsPerRow + (j - 1)].skuCode
              }`
            "
            :imageSrc="products[(i - 1) * elementsPerRow + (j - 1)].image"
          />
        </v-col>
      </v-row>

      <v-row class="d-flex flex-row justify-space-around">
        <v-col
          v-for="j in productsCount -
            Math.floor(productsCount / elementsPerRow) * elementsPerRow"
          :key="j"
          class="d-flex flex-column flex-grow-0 mt-4"
        >
          <v-container class="pa-0">
            <v-row class="pa-0 mx-0">
              <v-col cols="5" class="pa-0">
                <v-btn
                  @click="
                    showDeleteAssertionWindow = true;
                    productToDeleteID =
                      products[
                        Math.floor(productsCount / elementsPerRow) *
                          elementsPerRow +
                          (j - 1)
                      ]._id;
                  "
                  class="red--text"
                >
                  {{ $t("remove") }}
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="2"></v-col>
              <v-col cols="5" class="pa-0">
                <v-btn
                  @click="
                    showEditProductWindow = true;
                    productToEdit =
                      products[
                        Math.floor(productsCount / elementsPerRow) *
                          elementsPerRow +
                          (j - 1)
                      ];
                  "
                  class="secondary--text"
                >
                  {{ $t("edit") }}
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
          <product-card
            :prices="generalProductPrices"
            :title="
              `${itemTitle(tabs[tabIndex])}-${
                products[
                  Math.floor(productsCount / elementsPerRow) * elementsPerRow +
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
    <v-overlay
      z-index="11"
      opacity="0.8"
      v-if="showAddNewProductWindow"
      :value="true"
    >
      <div class="my-10">
        <v-btn icon @click="closeAddNewProductWindow">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <admin-add-product
          v-on:product-added="addProduct($event)"
        ></admin-add-product>
      </div>
    </v-overlay>
    <v-overlay
      z-index="11"
      opacity="0.8"
      v-if="showEditProductWindow"
      :value="true"
    >
      <div class="my-10">
        <v-btn icon @click="closeEditProductWindow">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <admin-edit-product
          v-on:product-updated="updateProduct($event)"
          :productID="productToEdit._id"
          :skuCodeProp="productToEdit.skuCode"
        ></admin-edit-product>
      </div>
    </v-overlay>
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
              <v-btn color="success" @click="deleteProductSubmit">
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
  </v-card>
</template>

<script>
import ProductCard from "./ProductCard";
import AdminAddProduct from "./AdminAddProduct";
import AdminEditProduct from "./AdminEditProduct";
import productsMixin from "@/mixins/productsMixin";
import { deleteProductMixin } from "@/mixins/apiMixins";

export default {
  name: "admin-products",
  mixins: [productsMixin, deleteProductMixin],
  components: {
    ProductCard,
    AdminAddProduct,
    AdminEditProduct
  },
  watch: {},
  data() {
    return {
      productToEdit: null,
      productToDeleteID: null,
      deletedSuccessfully: "none"
    };
  },
  computed: {},
  methods: {
    deleteProductSubmit: async function() {
      this.deletedSuccessfully = (await this.deleteProduct(
        this.productToDeleteID
      ))
        ? "success"
        : "fail";
      if (this.deletedSuccessfully === "success") {
        await this.getProducts(this.currentCategory, 1);
        this.productToDeleteID = null;
      }
    },
    updateProduct(product) {
      const index = this.products.findIndex(p => p._id === product._id);
      if (index > 0) {
        this.products[index] = product;
      }
    },
    addProduct(product) {
      if (
        this.products.length < Number(this.elementsPerPage) &&
        this.currentCategory === product.generalProduct.productName
      ) {
        this.products.push(product);
        this.productsCount++;
        if (this.pagesCount === 0) this.pagesCount = 1;
      }
    },
    closeDeleteAssertionWindow: function() {
      this.showDeleteAssertionWindow = false;
      this.deletedSuccessfully = "none";
    },
    closeAddNewProductWindow: function() {
      this.showAddNewProductWindow = false;
    },
    closeEditProductWindow: function() {
      this.showEditProductWindow = false;
    },
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
</style>
