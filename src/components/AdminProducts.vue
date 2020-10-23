<template>
  <v-card tile flat class="main" v-if="dataFetched">
    <h2 class="text-center py-10 secondary--text">Our Products</h2>
    <v-container class="d-flex flex-column align-content-space-around">
      <v-row class="d-flex flex-row">
        <v-col cols="3" sm="6" class="pl-4 d-flex flex-grow-0 flex-shrink-1">
          <v-btn class="success" small @click="showAddNewProductWindow = true">
            Add New Product
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
                  Remove
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
                  Edit
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
          <product-card
            :prices="generalProductPrices"
            :title="
              `${tabs[tabIndex].title}-${
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
                  Remove
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
                  Edit
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
          <product-card
            :prices="generalProductPrices"
            :title="
              `${tabs[tabIndex].title}-${
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
          <p>Are you sure you want to delete this product?</p>
          <v-row>
            <v-col cols="4">
              <v-btn color="error" @click="showDeleteAssertionWindow = false">
                No
              </v-btn>
            </v-col>
            <v-col cols="4"></v-col>
            <v-col cols="4">
              <v-btn color="success" @click="deleteProduct">
                Yes
              </v-btn>
            </v-col>
          </v-row>
        </template>
        <v-alert type="error" v-if="deletedSuccessfully === 'fail'"
          >Error. product cannot be deleted. Please try again.</v-alert
        >
        <v-alert type="success" v-if="deletedSuccessfully === 'success'"
          >Deleted successfully.</v-alert
        >
      </div>
    </v-overlay>
  </v-card>
</template>

<script>
import ProductCard from "./ProductCard";
import AdminAddProduct from "./AdminAddProduct";
import AdminEditProduct from "./AdminEditProduct";

export default {
  name: "admin-products",
  components: {
    ProductCard,
    AdminAddProduct,
    AdminEditProduct
  },
  watch: {},
  data: () => ({
    dataFetched: false,
    productsCount: 0,
    elementsPerRow: 3,
    elementsPerPage: process.env.VUE_APP_PRODUCTS_ELEMENTS_PER_PAGE,
    page: 1,
    pagesCount: 1,
    productToEdit: null,
    productToDeleteID: null,
    deletedSuccessfully: "none",

    tabIndex: 0,
    tabs: [
      { title: "Decoration Tableau", category: "Decoration tableau" },
      { title: "Mersal", category: "Mersal" }
    ],
    showAddNewProductWindow: false,
    showEditProductWindow: false,
    showDeleteAssertionWindow: false,
    // sortByOptions: [
    //   {
    //     text: "Recently Added",
    //     value: "recent",
    //   },
    //   {
    //     text: "Price: Low To High",
    //     value: "price",
    //   },
    //   {
    //     text: "Price: High To Low",
    //     value: "-price",
    //   },
    // ],
    generalProductPrices: [],
    products: []
  }),
  computed: {
    currentCategory() {
      return this.tabs[this.tabIndex].category;
    }
  },
  methods: {
    deleteProduct: async function() {
      try {
        const res = await this.$http.delete(
          `/products/${this.productToDeleteID}`,
          {
            headers: { Authorization: this.$store.getters.adminAuthJwt }
          }
        );
        if (res.status === 200) {
          this.deletedSuccessfully = "success";
          // this.showDeleteAssertionWindow = false;
          // const productIndex = this.products.findIndex(
          //   product => product._id === this.productToDeleteID
          // );
          // this.products.splice(productIndex, 1);
          // this.productsCount--;
          await this.getProducts(this.currentCategory, 1);
          this.productToDeleteID = null;
        } else this.deletedSuccessfully = "fail";
      } catch (err) {
        this.deletedSuccessfully = "fail";
      }
    },
    getProducts: async function(category, pageNumber) {
      let res = await this.$http.get(
        `/products?productCategories=${category}&page=${pageNumber}&limit=${this.elementsPerPage}`
      );
      // console.log(res);
      this.pagesCount = Math.ceil(res.data.totalSize / this.elementsPerPage);
      this.productsCount = res.data.size;

      this.products = res.data.products;
      // console.log(this.products);
      let generalProductPrices;
      if (
        Object.keys(this.$store.getters.nonCustomGeneralProducts).length === 0
      ) {
        res = await this.$http.get(`/general-products/non-custom-products`);

        this.$store.dispatch("setNonCustomGeneralProducts", res.data.products);

        const generalProductIndex = res.data.products.findIndex(
          product => product.productName === category
        );
        generalProductPrices = Object.values(
          res.data.products[generalProductIndex].sizesPrices
        );
      } else {
        generalProductPrices = Object.values(
          this.$store.getters.nonCustomGeneralProducts[category].sizesPrices
        );
      }
      this.generalProductPrices = generalProductPrices;
      this.page = pageNumber;
    },
    updateProduct(product) {
      const index = this.products.findIndex(p => p._id === product._id);
      if (index > 0) {
        this.products[index] = product;
      }
    },
    addProduct(product) {
      if (this.products.length < Number(this.elementsPerPage)) {
        this.products.push(product);
        this.productsCount++;
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
    }
  },
  mounted: async function() {
    //default tab is decoration tableaus
    await this.getProducts("Decoration tableau", this.page);
    this.dataFetched = true;
  }
};
</script>

<style scoped>
h2 {
  font-family: "Advent Pro";
  font-size: 30px;
  font-weight: bolder;
}
.main {
  background-image: url("~@/assets/sketch-texture.png") !important;
  background-repeat: repeat;
  background-size: 600px 600px;
  background-color: black !important;
  border-radius: 10px !important;
}
</style>
