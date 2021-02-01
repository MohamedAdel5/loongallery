<template>
  <v-card class="main mb-16" v-if="dataFetched">
    <h2 class="text-center py-10 secondary--text">
      {{ $t("make_a_custom_order") }}
    </h2>
    <v-container class="d-flex flex-column align-content-space-around pa-10">
      <v-form v-model="valid" ref="form">
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
                @change="selectFile"
              ></v-file-input>
            </v-row>
            <v-row class="pt-6">
              <v-text-field
                :disabled="!addToCartButton"
                v-model="numberOfFaces"
                min="0"
                :rules="numberOfFacesRules"
                type="number"
                :label="$t('number_of_faces_note')"
                persistent-hint
                :hint="$t('number_of_faces_hint')"
                dense
              ></v-text-field>
            </v-row>
            <v-row>
              <v-col cols="6" class="d-flex justify-left align-center pa-0">
                <v-label
                  ><span class="dark--text caption">{{
                    $t("choose_drawing_style")
                  }}</span></v-label
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
                <v-label
                  ><span class="dark--text caption">{{
                    $t("choose_size")
                  }}</span></v-label
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
          <v-col cols="12" class="d-flex justify-end pt-16 pb-0">
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
        <v-container id="productsDetails">
          <v-row>
            <v-col cols="12">
              <h3>Our products and their delivery times:</h3>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <h4>Digital Portrait</h4>
              <ul>
                <li>
                  Material <br />
                  <ul>
                    <li>Printed on a 12mm MDF wood.</li>
                    <li>
                      Has two hangers on the back to be hanged either
                      horizontally or vertically.
                    </li>
                    <li>
                      Has an extra protection screen to protect it from water
                      and dust.
                    </li>
                    <li>Has a leather-like texture and can cleaned easily.</li>
                  </ul>
                </li>
                <li>
                  Delivery time <br />
                  <ul>
                    <li>Delivery to a home: 3-5 days</li>
                    <li>Delivery to a metro station: 2-3 days</li>
                    <li>Receive from our branch location: 2-3 days</li>
                  </ul>
                </li>
              </ul>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <h4>Wood carving</h4>
              <ul>
                <li>
                  Material <br />
                  <ul>
                    <li>Natural wood.</li>
                    <li>
                      It has text carved in it. You can write:
                      <ul>
                        <li>A name</li>
                        <li>A date</li>
                        <li>A quote</li>
                      </ul>
                    </li>
                  </ul>
                </li>
                <li>
                  Delivery time <br />
                  <ul>
                    <li>Delivery to a home: within 7 days</li>
                    <li>Delivery to a metro station: within 7 days</li>
                    <li>Receive from our branch location: within 7 days</li>
                  </ul>
                </li>
              </ul>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <h4>Others (Pencil, Pen, Coal, Gouache, watercolor)</h4>
              <ul>
                <li>
                  Material <br />
                  <ul>
                    <li>Hand drawing on heavy paper (canson).</li>
                    <li>Kept in a black wood frame.</li>
                  </ul>
                </li>
                <li>
                  Delivery time <br />
                  <ul>
                    <li>Delivery to a home: within 7 days</li>
                    <li>Delivery to a metro station: within 7 days</li>
                    <li>Receive from our branch location: within 7 days</li>
                  </ul>
                </li>
              </ul>
            </v-col>
          </v-row>
        </v-container>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import {
  setCustomGeneralProductsMixin,
  setFacePriceMixin
} from "@/mixins/apiMixins";
export default {
  name: "custom-order",
  mixins: [setCustomGeneralProductsMixin, setFacePriceMixin],
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
        return (
          (this.$store.getters.customGeneralProducts[this.drawingStyle]
            .sizesPrices[this.size] +
            facesPrice) *
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
      quantityRules: [v => v >= 1 || this.$t("quantity_err")],
      numberOfFaces: 1,
      numberOfFacesRules: [
        v => v === 0 || !!v || this.$t("number_of_faces_err1"),
        v => v >= 0 || this.$t("number_of_faces_err2")
      ],
      addToCartButton: true,
      valid: false,
      dataFetched: false
    };
  },
  methods: {
    selectFile(file) {
      this.uploadedImage = file;
    },
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
</style>
