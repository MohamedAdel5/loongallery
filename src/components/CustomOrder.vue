<template>
  <v-card class="main mb-16" v-if="dataFetched">
    <h2 class="text-center py-10 secondary--text">
      {{ $t("make_a_custom_order") }}
    </h2>
    <v-container class="d-flex flex-column align-content-space-around pa-10">
      <v-form v-model="valid" ref="form" :key="$root.$i18n.locale">
        <v-row>
          <v-col cols="10">
            <v-row
              style="border: solid 1px grey; border-radius: 5px; color: rgba(50, 46, 46, 0.87)"
              class="my-2"
            >
              <v-col cols="12">
                <v-container>
                  <h5>{{ $t("custom_order_notes_main") }}</h5>
                  <ol class="caption">
                    <li>
                      {{ $t("custom_order_notes_l1") }}
                    </li>
                    <li>
                      {{ $t("custom_order_notes_l2") }}
                    </li>
                    <li>
                      {{ $t("custom_order_notes_l3") }}
                    </li>
                  </ol>
                </v-container>
                <v-divider></v-divider>
                <v-container>
                  <h5>
                    <a href="#productsDetails" class="brown--text">{{
                      $t("products_details")
                    }}</a>
                  </h5>
                </v-container>
              </v-col>
            </v-row>
            <v-row class="ma-0">
              <p class="font-weight-light secondary--text ma-0">
                {{ $t("upload_image") }}
              </p>
            </v-row>
            <v-row>
              <v-file-input
                :disabled="!addToCartButton"
                dense
                accept="image/*"
                :label="$t('select_image')"
                v-model="uploadedImage"
                :rules="fileRules"
              ></v-file-input>
            </v-row>
            <v-row class="pt-6">
              <v-text-field
                :disabled="!addToCartButton"
                v-model="numberOfFaces"
                :rules="numberOfFacesRules"
                min="0"
                :label="$t('number_of_faces_note')"
                persistent-hint
                :hint="$t('number_of_faces_hint')"
                type="number"
                dense
              ></v-text-field>
            </v-row>
            <v-row>
              <v-col cols="6" class="d-flex justify-left align-center pa-0">
                <label
                  ><span class="dark--text caption">{{
                    $t("choose_drawing_style")
                  }}</span></label
                >
              </v-col>
              <v-col
                cols="6"
                class="d-flex justify-center align-center sizeRow"
              >
                <v-select
                  :disabled="!addToCartButton"
                  v-model="drawingStyle"
                  :items="customDrawingStyles"
                  standard
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <router-link
                class=" blue--text subtitle-2"
                :to="'/drawing-styles-examples'"
                >{{ $t("drawing_styles_examples") }}</router-link
              >
            </v-row>
            <v-row>
              <v-col cols="6" class="d-flex justify-left align-center pa-0">
                <label
                  ><span class="dark--text caption">{{
                    $t("choose_size")
                  }}</span></label
                >
              </v-col>
              <v-col
                cols="6"
                class="d-flex justify-center align-center sizeRow"
              >
                <v-select
                  :disabled="!addToCartButton"
                  v-model="size"
                  :items="portraitSizes"
                  standard
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <router-link
                class=" blue--text subtitle-2"
                :to="'/preview-sizes'"
                >{{ $t("preview_sizes") }}</router-link
              >
            </v-row>
            <v-row class="d-block pt-4">
              <label>{{ $t("other_notes") }}</label>
              <v-textarea
                :disabled="!addToCartButton"
                v-model="otherNotes"
                outlined
                dense
              ></v-textarea>
            </v-row>
            <v-row>
              <v-checkbox v-model="addGiftWrap">
                <template v-slot:label>
                  <label class="px-2"
                    >{{ $t("add_gift_wrap") }} -
                    {{ $store.getters.giftWrapPrice }} LE</label
                  >
                  <v-img
                    :src="require('@/assets/logo.jpg')"
                    max-height="40px"
                    max-width="40px"
                  />
                </template>
              </v-checkbox>
            </v-row>
            <v-row class="pt-6">
              <v-checkbox v-model="addGiftBow">
                <template v-slot:label>
                  <label class="px-2"
                    >{{ $t("add_gift_bow") }} -
                    {{ $store.getters.giftBowPrice }} LE</label
                  >
                  <v-img
                    :src="require('@/assets/logo.jpg')"
                    max-height="40px"
                    max-width="40px"
                  />
                </template>
              </v-checkbox>
            </v-row>
            <v-row class="pt-6">
              <v-text-field
                :disabled="!addToCartButton"
                v-model="quantity"
                min="1"
                :rules="quantityRules"
                type="number"
                :label="$t('quantity')"
                dense
              ></v-text-field>
            </v-row>
            <v-row class="mt-10">
              <v-col
                cols="12"
                class="d-flex justify-left align-center pa-0"
                sm="6"
              >
                <h4>
                  {{ $t("price") }}:<br />
                  {{ price }} LE
                </h4>
              </v-col>
              <v-col cols="12" class="pa-0" sm="6">
                <v-btn
                  v-if="addToCartButton"
                  @click="
                    addToCart();
                    hideAddToCart();
                  "
                  :disabled="!price"
                  max-width="200px"
                  color="success"
                  >{{ $t("add_to_cart") }} <v-icon>mdi-cart</v-icon></v-btn
                >
                <span v-if="!addToCartButton" class="secondary--text pr-2">{{
                  $t("product_added_to_cart")
                }}</span>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="d-flex justify-end pt-16 pb-2">
            <v-btn
              v-if="!addToCartButton"
              @click="makeAnotherOrder"
              max-width="200px"
              color="secondary"
              >{{ $t("make_another_order") }}</v-btn
            >
          </v-col>
        </v-row>
      </v-form>
      <v-divider></v-divider>
      <v-row style="border: solid 1px grey; border-radius: 5px" class="mt-10">
        <v-container id="productsDetails" class="pa-2">
          <custom-products-details />
        </v-container>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import {
  setCustomGeneralProductsMixin,
  setFacePriceMixin,
  setGiftBowPriceMixin,
  setGiftWrapPriceMixin
} from "@/mixins/apiMixins";
import CustomProductsDetails from "./CustomProductsDetails";

export default {
  name: "custom-order",
  mixins: [
    setCustomGeneralProductsMixin,
    setFacePriceMixin,
    setGiftBowPriceMixin,
    setGiftWrapPriceMixin
  ],
  components: {
    CustomProductsDetails
  },
  computed: {
    portraitSizes() {
      if (this.$store.getters.customDrawingStyles.includes(this.drawingStyle)) {
        return Object.keys(
          this.$store.getters.customGeneralProducts[this.drawingStyle]
            .sizesPrices
        );
      } else return [];
    },
    customDrawingStyles() {
      if (this.$root.$i18n.locale === "en")
        return this.$store.getters.customDrawingStyles;
      else {
        const items = [];
        const customGeneralProducts = this.$store.getters.customGeneralProducts;
        for (let product of Object.keys(customGeneralProducts)) {
          items.push({
            text: customGeneralProducts[product].productName_Ar,
            value: product
          });
        }
        return items;
      }
    },

    price() {
      if (this.valid && this.size) {
        let facesPrice;
        if (this.numberOfFaces >= 1)
          facesPrice = (this.numberOfFaces - 1) * this.$store.getters.facePrice;
        else facesPrice = 0;
        let extraCost = 0;
        if (this.addGiftBow) extraCost += this.$store.getters.giftBowPrice;
        if (this.addGiftWrap) extraCost += this.$store.getters.giftWrapPrice;

        return (
          (this.$store.getters.customGeneralProducts[this.drawingStyle]
            .sizesPrices[this.size] +
            facesPrice +
            extraCost) *
          this.quantity
        );
      } else return "";
    }
  },
  data() {
    return {
      uploadedImage: null,
      drawingStyle: "",
      size: "",
      quantity: 1,
      otherNotes: "",
      addGiftBow: false,
      addGiftWrap: false,
      quantityRules: [v => v >= 1 || this.$t("quantity_err")],
      numberOfFaces: 1,
      numberOfFacesRules: [
        v => v === 0 || !!v || this.$t("number_of_faces_err1"),
        v => v >= 0 || this.$t("number_of_faces_err2")
      ],
      addToCartButton: true,
      valid: false,
      dataFetched: false,
      fileRules: [v => !!v || this.$t("file_err")]
    };
  },
  methods: {
    // selectFile(file) {
    //   this.uploadedImage = file;
    // },
    addToCart: function() {
      //Upload Image and get the link.
      //make an object contains the props {image, price, size, categories}
      this.$refs.form.validate();
      if (!this.valid) {
        return;
      }
      const product = {
        image: this.uploadedImage,
        size: this.size,
        // productCategories: ["Custom", this.drawingStyle],
        generalProduct: this.$store.getters.customGeneralProducts[
          this.drawingStyle
        ].id,
        numberOfFaces: this.numberOfFaces,
        quantity: this.quantity,
        price: this.price
      };
      let extraNotes = "";
      if (this.addGiftBow) extraNotes += " ضافة فيونكة.\n ";
      if (this.addGiftWrap) extraNotes += " إضافة تغليف هدايا.\n ";

      if (this.otherNotes.length > 0)
        product.otherNotes = `${extraNotes} \n ${this.otherNotes}`;

      this.$store.dispatch("addToCart", product);
    },

    hideAddToCart: function() {
      this.addToCartButton = false;
    },
    makeAnotherOrder: function() {
      this.uploadedImage = null;
      this.imageURL = "";
      this.drawingStyle = "";
      this.size = "";
      this.quantity = 1;
      this.addToCartButton = true;
      this.numberOfFaces = 1;
    }
  },
  created: async function() {
    await this.setCustomGeneralProducts();
    await this.setFacePrice();
    await this.setGiftBowPrice();
    await this.setGiftWrapPrice();

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
.sizeRow {
  max-height: 50px;
}
.v-select-list,
.v-select {
  direction: ltr !important;
}
label {
  color: rgba(0, 0, 0, 0.6) !important;
  font-size: 13px;
  display: block;
}
</style>
