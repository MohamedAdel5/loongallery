<template>
  <v-card class="main" light>
    <v-card-title class="d-block"
      ><p class="text-center secondary--text ma-0 pa-0">
        {{ $t("add_product") }}
      </p></v-card-title
    >
    <v-card-actions class="ma-0 pa-0 pl-6">
      <v-container>
        <v-form v-model="valid" ref="form" :key="$root.$i18n.locale">
          <v-row>
            <v-col cols="10">
              <v-row>
                <v-col cols="12" class="d-flex justify-left align-center pa-0">
                  <v-label
                    ><span class="black--text caption">
                      {{ $t("product_image") }}
                      (300x300)px</span
                    ></v-label
                  >
                </v-col>
              </v-row>
              <!-- Visit this page for ore info about how to upload files in vue: https://bezkoder.com/vuetify-file-upload/ -->
              <v-row>
                <v-col cols="12" class="d-flex justify-left align-center pa-0">
                  <v-file-input
                    dense
                    accept="image/*"
                    :label="$t('select_image')"
                    v-model="uploadedImage"
                    :rules="fileRules"
                  ></v-file-input>
                </v-col>
              </v-row>
              <v-row class="py-2">
                <v-col cols="6" class="d-flex justify-left align-center pa-0">
                  <v-label
                    ><span class="black--text caption">{{
                      $t("sku_code")
                    }}</span></v-label
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
                    ><span class="black--text caption">{{
                      $t("product_category")
                    }}</span></v-label
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
                    :rules="categoryRules"
                  >
                  </v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" class="pa-0">
                  <p class="caption">
                    {{ $t("product_description") }}
                  </p>
                  <v-textarea
                    v-model="productDescription"
                    rows="4"
                  ></v-textarea>
                </v-col>
              </v-row>
              <v-row class="mt-10">
                <v-col cols="12" class="pa-0" sm="6">
                  <v-btn
                    @click="addProductSubmit"
                    max-width="200px"
                    color="success"
                    >{{ $t("submit") }}</v-btn
                  >
                </v-col>
              </v-row>

              <v-row class="mt-10">
                <v-col cols="12" class="pa-0" sm="6">
                  <v-alert type="error" v-if="responseResult === 'fail'"
                    >{{ $t("save_fail") }} <br />
                    {{ $t("edit_fail_note") }}</v-alert
                  >
                  <v-alert type="success" v-if="responseResult === 'success'">{{
                    $t("save_success")
                  }}</v-alert>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-form>
      </v-container>
    </v-card-actions>
  </v-card>
</template>

<script>
import { addProductMixin } from "@/mixins/apiMixins";

export default {
  name: "admin-add-product",
  mixins: [addProductMixin],
  computed: {
    categories() {
      if (this.$root.$i18n.locale === "en")
        return this.$store.getters.categories;
      else {
        const items = [];
        const nonCustomGeneralProducts = this.$store.getters
          .nonCustomGeneralProducts;
        for (let product of Object.keys(nonCustomGeneralProducts)) {
          items.push({
            text: nonCustomGeneralProducts[product].productName_Ar,
            value: product
          });
        }
        return items;
      }
    }
  },
  data() {
    return {
      uploadedImage: undefined, //uploaded image
      responseResult: "none",
      productCategory: "",
      productSkuCode: "",
      productDescription: "",
      productSkuCodeRules: [
        v => !!v || this.$t("sku_code_err2"),
        v => (v && v.length <= 20) || this.$t("sku_code_err1")
      ],
      fileRules: [v => !!v || this.$t("file_err")],
      categoryRules: [v => !!v || this.$t("category_err")],
      valid: false
    };
  },
  methods: {
    // selectFile(file) {
    //   this.uploadedImage = file;
    // },
    addProductSubmit: async function() {
      this.$refs.form.validate();
      if (!this.valid) {
        return;
      }
      let formData = new FormData();
      formData.append("image", this.uploadedImage);
      // formData.append("productCategories", [this.productCategory]);
      formData.append(
        "generalProduct",
        this.$store.getters.nonCustomGeneralProducts[this.productCategory].id
      );
      formData.append("skuCode", this.productSkuCode);

      formData.append("description", this.productDescription);

      const newProduct = await this.addProduct(formData);
      this.responseResult = newProduct ? "success" : "fail";
      if (this.responseResult === "success") {
        this.$emit("product-added", newProduct);
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
