<template>
  <v-card class="main" light>
    <h2 class="text-center py-10 secondary--text">Add New Product</h2>
    <v-container class="d-flex flex-column align-content-space-around pa-10">
      <v-form v-model="valid" ref="form">
        <v-row>
          <v-col cols="10">
            <v-row>
              <p class="font-weight-light secondary--text">
                Upload Product Image
              </p>
            </v-row>
            <v-row>
              <!-- Visit this page for upload info https://bezkoder.com/vuetify-file-upload/ -->
              <v-file-input
                dense
                accept="image/*"
                label="Select From Device..."
                @change="selectFile"
                :rules="fileRules"
              ></v-file-input>
            </v-row>
            <v-row class="py-2">
              <v-col cols="6" class="d-flex justify-left align-center pa-0">
                <v-label
                  ><span class="black--text caption"
                    >Product skuCode</span
                  ></v-label
                >
              </v-col>
              <v-col
                cols="6"
                class="d-flex justify-center align-center sizeRow"
              >
                <v-text-field
                  v-model="productSkuCode"
                  :rules="productSkuCodeRules"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="py-2">
              <v-col cols="6" class="d-flex justify-left align-center pa-0">
                <v-label
                  ><span class="black--text caption"
                    >Choose Category</span
                  ></v-label
                >
              </v-col>
              <v-col
                cols="6"
                class="d-flex justify-center align-center sizeRow"
              >
                <v-select
                  v-model="productCategory"
                  dense
                  single-line
                  :items="categories"
                  standard
                  label="style"
                  :rules="categoryRules"
                >
                </v-select>
              </v-col>
            </v-row>

            <v-row class="mt-10">
              <v-col cols="12" class="pa-0" sm="6">
                <v-btn @click="addProduct" max-width="200px" color="success"
                  >Add</v-btn
                >
              </v-col>
            </v-row>
            <v-row class="mt-10">
              <v-col cols="12" class="pa-0" sm="6">
                <v-alert type="error" v-if="responseResult === 'fail'"
                  >Failed to make the product. Please check that the SKU code is
                  unique (Not the same as another product) and try
                  again.</v-alert
                >
                <v-alert type="success" v-if="responseResult === 'success'"
                  >Product is added successfully.</v-alert
                >
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: "admin-add-product",

  computed: {
    categories() {
      return this.$store.getters.categories;
    }
  },
  data: () => ({
    uploadedImage: undefined, //uploaded image
    responseResult: "none",
    productCategory: "",
    productSkuCode: "",
    productSkuCodeRules: [
      v => !!v || "Product code is required",
      v => (v && v.length <= 20) || "Product code must not exceed 20 characters"
    ],
    fileRules: [v => !!v || "Select a file."],
    categoryRules: [v => !!v || "Choose a category."],
    valid: false
  }),
  methods: {
    selectFile(file) {
      this.uploadedImage = file;
    },
    addProduct: async function() {
      this.$refs.form.validate();
      if (!this.valid) {
        return;
      }
      let formData = new FormData();
      formData.append("image", this.uploadedImage);
      formData.append("productCategories", [this.productCategory]);
      formData.append("skuCode", this.productSkuCode);
      try {
        const res = await this.$http.post(`/products`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: this.$store.getters.adminAuthJwt
          }
        });
        if (res.status === 200) this.responseResult = "success";
        else this.responseResult = "fail";
      } catch (err) {
        this.responseResult = "fail";
      }
      //if no errors, send post request
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
.sizeRow {
  max-height: 50px;
}
.main {
  background-image: url("~@/assets/black-wall-texture.png") !important;
  background-repeat: repeat;
  background-size: 400px 400px;
  background-color: black !important;
  border-radius: 10px !important;
}
@media screen and (min-width: 800px) {
  .main {
    min-width: 700px !important;
  }
}
</style>
