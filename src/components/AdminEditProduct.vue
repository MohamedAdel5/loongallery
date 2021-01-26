<template>
  <v-card class="main" light>
    <h2 class="text-center pt-10 secondary--text">Edit Product</h2>
    <p class="text-center secondary--text">SKU code: {{ skuCodeProp }}</p>
    <p class="text-center pb-8 secondary--text">_id: {{ productID }}</p>

    <v-container class="d-flex flex-column align-content-space-around pa-10">
      <v-row>
        <v-col cols="12">
          <v-form v-model="valid" ref="form">
            <v-row>
              <p class="font-weight-light secondary--text">
                Edit Fields
              </p>
            </v-row>
            <v-row>
              <!-- Visit this page for upload info https://bezkoder.com/vuetify-file-upload/ -->
              <v-col cols="6">
                <v-label
                  ><span class="black--text caption"
                    >Product Image (300x300)pixels</span
                  ></v-label
                >
              </v-col>
              <v-col cols="6">
                <v-file-input
                  dense
                  accept="image/*"
                  label="Select From Device..."
                  @change="selectFile"
                ></v-file-input>
              </v-col>
            </v-row>
            <v-row class="py-2">
              <v-col cols="6" class="d-flex justify-left align-center pa-0">
                <v-label
                  ><span class="black--text caption"
                    >Product SKU Code</span
                  ></v-label
                >
              </v-col>
              <v-col
                cols="6"
                class="d-flex justify-center align-center sizeRow"
              >
                <v-text-field v-model="skuCode"></v-text-field>
              </v-col>
            </v-row>
            <v-row class="py-2">
              <v-col cols="6" class="d-flex justify-left align-center pa-0">
                <v-label
                  ><span class="black--text text caption"
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
                >
                </v-select>
              </v-col>
            </v-row>

            <v-row class="mt-10">
              <v-col cols="12" class="pa-0" sm="6">
                <v-btn @click="applyChanges" max-width="200px" color="success"
                  >Apply Changes</v-btn
                >
              </v-col>
            </v-row>
          </v-form>
        </v-col>
      </v-row>
      <v-alert type="success" v-if="responseResult === 'success'"
        >Updated successfully</v-alert
      >
      <v-alert type="error" v-if="responseResult === 'fail'"
        >Failed to update the product. Please check that the SKU code is unique
        (Not the same as another product) and try again.</v-alert
      >
    </v-container>
  </v-card>
</template>

<script>
import { editProductMixin } from "@/mixins/apiMixins";

export default {
  name: "admin-edit-product",
  mixins: [editProductMixin],
  props: ["productID", "skuCodeProp"],
  computed: {
    categories() {
      return this.$store.getters.categories;
    }
  },
  data: () => ({
    valid: false,
    responseResult: "none",
    uploadedImage: null,
    productCategory: "",
    skuCode: "",
    skuCodeRules: [
      v => (v && v.length <= 20) || "SKU code must not exceed 20 characters."
    ]
  }),
  methods: {
    selectFile(file) {
      this.uploadedImage = file;
    },
    applyChanges: async function() {
      // this.$refs.form.validate();
      // if (!this.valid) {
      //   return;
      // }
      if (this.skuCode.length > 20) {
        this.responseResult = "fail";
        return;
      }

      let formData = new FormData();

      if (this.uploadedImage !== null)
        formData.append("image", this.uploadedImage);
      if (this.skuCode.length !== 0) formData.append("skuCode", this.skuCode);
      if (this.productCategory.length !== 0)
        formData.append(
          "generalProduct",
          this.$store.getters.nonCustomGeneralProducts[this.productCategory].id
        );

      const product = await this.editProduct(formData);
      this.responseResult = product ? "success" : "fail";
      if (this.responseResult == "success") {
        this.$emit("product-updated", product);
      }
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
@media screen and (min-width: 800px) {
  .main {
    min-width: 700px !important;
  }
}
</style>
