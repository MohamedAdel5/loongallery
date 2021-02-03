<template>
  <v-card class="main" light v-if="dataFetched">
    <h2 class="text-center py-10 secondary--text">{{ $t("edit_prices") }}</h2>
    <v-container class="d-flex flex-column align-content-space-around pa-10">
      <p class="text-center red--text" style="border: solid 2px red">
        {{ $t("prices_warning") }}
      </p>
      <v-form v-model="valid" ref="form" :key="$root.$i18n.locale">
        <v-row>
          <v-col cols="12">
            <v-container>
              <v-row
                ><h3 class="secondary--text">
                  {{ $t("custom_products_sizes_prices") }}
                </h3></v-row
              >
              <v-container
                v-for="(style, i) in Object.keys(customGeneralProducts)"
                :key="i"
              >
                <v-row
                  ><h4 class="secondary--text">
                    {{ getProductName(style) }}
                  </h4></v-row
                >
                <v-row
                  v-for="(size, j) in Object.entries(
                    customGeneralProducts[style].sizesPrices
                  )"
                  :key="j"
                >
                  <v-col cols="12" sm="8" md="4">
                    <label left class="ltr_dir d-inline-block"
                      >{{ size[0] }}:</label
                    >
                    <v-text-field
                      single-line
                      filled
                      suffix="LE"
                      :rules="numberRules"
                      v-model.number="
                        modifiedCustomGeneralProducts[style].sizesPrices[
                          size[0]
                        ]
                      "
                      type="number"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="d-flex justify-start">
                  <v-btn
                    @click="applyGeneralProductChanges(style, 'custom')"
                    color="secondary"
                    >{{ $t("submit") }}</v-btn
                  >
                </v-row>
              </v-container>
            </v-container>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row>
          <v-col cols="12">
            <v-container>
              <v-row
                ><h3 class="secondary--text">
                  {{ $t("non_custom_products_sizes_prices") }}
                </h3></v-row
              >
              <v-container
                v-for="(style, i) in Object.keys(nonCustomGeneralProducts)"
                :key="i"
              >
                <v-row
                  ><h4 class="secondary--text">
                    {{ getProductName(style) }}
                  </h4></v-row
                >
                <v-row
                  v-for="(size, j) in Object.entries(
                    nonCustomGeneralProducts[style].sizesPrices
                  )"
                  :key="j"
                >
                  <v-col cols="12" sm="8" md="4">
                    <label class="ltr_dir d-inline-block">{{ size[0] }}:</label>
                    <v-text-field
                      single-line
                      filled
                      suffix="LE"
                      :rules="numberRules"
                      v-model.number="
                        modifiedNonCustomGeneralProducts[style].sizesPrices[
                          size[0]
                        ]
                      "
                      type="number"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="d-flex justify-start">
                  <v-btn
                    @click="applyGeneralProductChanges(style, 'nonCustom')"
                    color="secondary"
                    >{{ $t("submit") }}</v-btn
                  >
                </v-row>
              </v-container>
            </v-container>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row>
          <v-col cols="12">
            <v-container>
              <v-row
                ><h3 class="secondary--text">
                  {{ $t("shipping_fees") }}
                </h3></v-row
              >
              <v-container>
                <v-row v-for="(shippingMethod, j) in shippingFees" :key="j">
                  <v-col cols="12" sm="8" md="4">
                    <label>{{ shippingMethod.name_en }}:</label>
                    <v-text-field
                      min="0"
                      single-line
                      filled
                      suffix="LE"
                      :rules="numberRules"
                      v-model.number="modifiedShippingFees[j].fees"
                      type="number"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="d-flex justify-start">
                  <v-btn
                    @click="
                      applyGlobalVariableChanges(
                        'shippingFees',
                        modifiedShippingFees
                      )
                    "
                    color="secondary"
                    >{{ $t("submit") }}</v-btn
                  >
                </v-row>
              </v-container>
            </v-container>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row>
          <v-col cols="12">
            <v-container>
              <v-row
                ><h3 class="secondary--text">
                  {{ $t("other_prices") }}
                </h3></v-row
              >
              <v-container>
                <v-row>
                  <v-col cols="12" sm="8" md="4">
                    <label>{{ $t("person_price") }}:</label>
                    <v-text-field
                      min="0"
                      single-line
                      filled
                      suffix="LE"
                      :rules="numberRules"
                      v-model.number="modifiedFacePrice"
                      type="number"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="d-flex justify-start">
                  <v-btn
                    @click="
                      applyGlobalVariableChanges('facePrice', modifiedFacePrice)
                    "
                    color="secondary"
                    >{{ $t("submit") }}</v-btn
                  >
                </v-row>
              </v-container>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="8" md="4">
                    <label>{{ $t("gift_bow_price") }}:</label>
                    <v-text-field
                      min="0"
                      single-line
                      filled
                      suffix="LE"
                      :rules="numberRules"
                      v-model.number="modifiedGiftBowPrice"
                      type="number"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="d-flex justify-start">
                  <v-btn
                    @click="
                      applyGlobalVariableChanges(
                        'giftBowPrice',
                        modifiedGiftBowPrice
                      )
                    "
                    color="secondary"
                    >{{ $t("submit") }}</v-btn
                  >
                </v-row>
              </v-container>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="8" md="4">
                    <label>{{ $t("gift_wrap_price") }}:</label>
                    <v-text-field
                      min="0"
                      single-line
                      filled
                      suffix="LE"
                      :rules="numberRules"
                      v-model.number="modifiedGiftWrapPrice"
                      type="number"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="d-flex justify-start">
                  <v-btn
                    @click="
                      applyGlobalVariableChanges(
                        'giftWrapPrice',
                        modifiedGiftWrapPrice
                      )
                    "
                    color="secondary"
                    >{{ $t("submit") }}</v-btn
                  >
                </v-row>
              </v-container>
            </v-container>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
    <v-overlay
      z-index="11"
      opacity="0.8"
      v-if="editedSuccessfully !== 'none'"
      :value="true"
    >
      <div class="my-10" v-click-outside="closeEditedSuccessfullyWindow">
        <v-btn icon @click="closeEditedSuccessfullyWindow">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-alert type="error" v-if="editedSuccessfully === 'fail'">{{
          $t("edit_err")
        }}</v-alert>
        <v-alert type="success" v-if="editedSuccessfully === 'success'">{{
          $t("edit_success")
        }}</v-alert>
      </div>
    </v-overlay>
  </v-card>
</template>

<script>
import {
  setCustomGeneralProductsMixin,
  setNonCustomGeneralProductsMixin,
  setShippingFeesMixin,
  setFacePriceMixin,
  editGeneralProductMixin,
  editGlobalVariableMixin,
  setGiftBowPriceMixin,
  setGiftWrapPriceMixin
} from "@/mixins/apiMixins";

export default {
  name: "admin-edit-prices",
  mixins: [
    setCustomGeneralProductsMixin,
    setNonCustomGeneralProductsMixin,
    setShippingFeesMixin,
    setFacePriceMixin,
    setGiftBowPriceMixin,
    setGiftWrapPriceMixin,
    editGeneralProductMixin,
    editGlobalVariableMixin
  ],

  data() {
    return {
      dataFetched: false,
      modifiedCustomGeneralProducts: {},
      modifiedNonCustomGeneralProducts: {},
      modifiedShippingFees: {},
      modifiedFacePrice: null,
      modifiedGiftBowPrice: null,
      modifiedGiftWrapPrice: null,

      editedSuccessfully: "none",

      valid: false,
      numberRules: [
        v => v === 0 || !!v || this.$t("number_err1"),
        v => /^[0-9]+$/.test(v) || this.$t("number_err2")
      ]
    };
  },

  methods: {
    applyGlobalVariableChanges: async function(
      globalVariableName,
      modifiedGlobalVariable
    ) {
      this.$refs.form.validate();
      if (this.valid) {
        //if no errors, send post request
        const updatedGlobalVariableObject = {};
        updatedGlobalVariableObject[
          globalVariableName
        ] = modifiedGlobalVariable;
        this.editedSuccessfully = (await this.editGlobalVariable(
          globalVariableName,
          updatedGlobalVariableObject
        ))
          ? "success"
          : "fail";
      }
    },
    applyGeneralProductChanges: async function(
      generalProductName,
      productType
    ) {
      this.$refs.form.validate();
      if (this.valid) {
        const generalProducts =
          productType === "custom"
            ? this.modifiedCustomGeneralProducts
            : this.modifiedNonCustomGeneralProducts;
        const newSizesPrices = generalProducts[generalProductName].sizesPrices;
        this.editedSuccessfully = (await this.editGeneralProduct(
          generalProductName,
          newSizesPrices
        ))
          ? "success"
          : "fail";
      }
    },
    closeEditedSuccessfullyWindow: function() {
      this.editedSuccessfully = "none";
    },
    getProductName(productName) {
      if (this.$root.$i18n.locale === "en") return productName;
      else {
        if (this.customGeneralProducts[productName])
          return this.customGeneralProducts[productName].productName_Ar;
        else return this.nonCustomGeneralProducts[productName].productName_Ar;
      }
    }
  },
  computed: {
    customGeneralProducts() {
      return this.$store.getters.customGeneralProducts;
    },
    nonCustomGeneralProducts() {
      return this.$store.getters.nonCustomGeneralProducts;
    },
    shippingFees() {
      return this.$store.getters.shippingFees;
    },
    facePrice() {
      return this.$store.getters.facePrice;
    },
    giftBowPrice() {
      return this.$store.getters.giftBowPrice;
    },
    giftWrapPrice() {
      return this.$store.getters.giftWrapPrice;
    }
  },
  mounted: async function() {
    await this.setCustomGeneralProducts();
    await this.setNonCustomGeneralProducts();
    await this.setShippingFees();
    await this.setFacePrice();
    await this.setGiftBowPrice();
    await this.setGiftWrapPrice();

    this.modifiedCustomGeneralProducts = JSON.parse(
      JSON.stringify(this.customGeneralProducts)
    );
    this.modifiedNonCustomGeneralProducts = JSON.parse(
      JSON.stringify(this.nonCustomGeneralProducts)
    );
    this.modifiedShippingFees = JSON.parse(JSON.stringify(this.shippingFees));
    this.modifiedFacePrice = this.facePrice;
    this.modifiedGiftBowPrice = this.giftBowPrice;
    this.modifiedGiftWrapPrice = this.giftWrapPrice;

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
</style>
