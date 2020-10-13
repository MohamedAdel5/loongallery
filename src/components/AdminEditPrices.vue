<template>
  <v-card class="main" light v-if="dataFetched">
    <h2 class="text-center py-10 secondary--text">Edit Products Prices</h2>
    <v-container class="d-flex flex-column align-content-space-around pa-10">
      <p class="text-center red--text" style="border: solid 2px red">
        Warning: You have to make sure all the prices are set correctly before
        you submit!
      </p>
      <v-form v-model="valid" ref="form">
        <v-row>
          <v-col cols="12">
            <v-container>
              <v-row
                ><h3 class="secondary--text">
                  Custom Drawing Sizes Prices
                </h3></v-row
              >
              <v-container
                v-for="(style, i) in Object.keys(customGeneralProducts)"
                :key="i"
              >
                <v-row
                  ><h4 class="secondary--text">{{ style }}</h4></v-row
                >
                <v-row
                  v-for="(size, j) in Object.entries(
                    customGeneralProducts[style].sizesPrices
                  )"
                  :key="j"
                >
                  <v-col cols="12" sm="8" md="4">
                    <v-label>{{ size[0] }}:</v-label>
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
                    >Submit</v-btn
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
                  Non Custom Drawing Sizes Prices
                </h3></v-row
              >
              <v-container
                v-for="(style, i) in Object.keys(nonCustomGeneralProducts)"
                :key="i"
              >
                <v-row
                  ><h4 class="secondary--text">{{ style }}</h4></v-row
                >
                <v-row
                  v-for="(size, j) in Object.entries(
                    nonCustomGeneralProducts[style].sizesPrices
                  )"
                  :key="j"
                >
                  <v-col cols="12" sm="8" md="4">
                    <v-label>{{ size[0] }}:</v-label>
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
                    >Submit</v-btn
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
              <v-row><h3 class="secondary--text">Shipping Fees</h3></v-row>
              <v-container>
                <v-row
                  v-for="(shippingMethod, j) in Object.entries(shippingFees)"
                  :key="j"
                >
                  <v-col cols="12" sm="8" md="4">
                    <v-label>{{ shippingMethod[0] }}:</v-label>
                    <v-text-field
                      min="0"
                      single-line
                      filled
                      suffix="LE"
                      :rules="numberRules"
                      v-model.number="modifiedShippingFees[shippingMethod[0]]"
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
                    >Submit</v-btn
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
              <v-row><h3 class="secondary--text">Face Price</h3></v-row>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="8" md="4">
                    <v-label>Face price:</v-label>
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
                    >Submit</v-btn
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
        <v-alert type="error" v-if="editedSuccessfully === 'fail'"
          >Error. Could not Edit. Please try again.</v-alert
        >
        <v-alert type="success" v-if="editedSuccessfully === 'success'"
          >Edited successfully.</v-alert
        >
      </div>
    </v-overlay>
  </v-card>
</template>

<script>
export default {
  name: "admin-edit-prices",
  data: () => ({
    dataFetched: false,
    modifiedCustomGeneralProducts: {},
    modifiedNonCustomGeneralProducts: {},
    modifiedShippingFees: {},
    modifiedFacePrice: null,
    editedSuccessfully: "none",

    valid: false,
    numberRules: [
      v => v === 0 || !!v || "This field is required!",
      v => /^[0-9]+$/.test(v) || "Only numbers are allowed!"
    ]
  }),
  methods: {
    applyGlobalVariableChanges: async function(
      globalVariableName,
      modifiedGlobalVariable
    ) {
      this.$refs.form.validate();
      if (this.valid) {
        //if no errors, send post request
        let editedSuccessfully = "success";
        try {
          // console.log(this.modifiedFacePrice);
          // console.log(this.modifiedShippingFees);

          const updatedGlobalVariableObject = {};
          updatedGlobalVariableObject[
            globalVariableName
          ] = modifiedGlobalVariable;

          // console.log(updatedGlobalVariableObject);

          const res = await this.$http.patch(
            `/global-variables/${globalVariableName}`,
            {
              updatedGlobalVariableObject
            },
            {
              headers: { Authorization: this.$store.getters.adminAuthJwt }
            }
          );
          if (res.status !== 200) editedSuccessfully = "fail";
        } catch (err) {
          editedSuccessfully = "fail";
        }
        this.editedSuccessfully = editedSuccessfully;
      }
    },
    applyGeneralProductChanges: async function(
      generalProductName,
      productType
    ) {
      this.$refs.form.validate();
      if (this.valid) {
        let editedSuccessfully = "success";
        try {
          const generalProducts =
            productType === "custom"
              ? this.modifiedCustomGeneralProducts
              : this.modifiedNonCustomGeneralProducts;

          // console.log(
          //   productType,
          //   generalProducts,
          //   generalProductName,
          //   generalProducts[generalProductName].sizesPrices
          // );

          const res = await this.$http.patch(
            `/general-products/${generalProductName}`,
            {
              sizesPrices: generalProducts[generalProductName].sizesPrices
            },
            {
              headers: { Authorization: this.$store.getters.adminAuthJwt }
            }
          );
          if (res.status !== 200) editedSuccessfully = "fail";
        } catch (err) {
          editedSuccessfully = "fail";
        }
        this.editedSuccessfully = editedSuccessfully;
      }
    },
    closeEditedSuccessfullyWindow: function() {
      this.editedSuccessfully = "none";
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
    }
  },
  mounted: async function() {
    try {
      let res;
      if (Object.keys(this.$store.getters.customGeneralProducts).length === 0) {
        res = await this.$http.get(`/general-products/custom-products`);
        this.$store.dispatch("setCustomGeneralProducts", res.data.products);
      }
      if (
        Object.keys(this.$store.getters.nonCustomGeneralProducts).length === 0
      ) {
        res = await this.$http.get(`/general-products/non-custom-products`);
        this.$store.dispatch("setNonCustomGeneralProducts", res.data.products);
      }

      if (Object.keys(this.$store.getters.shippingFees).length === 0) {
        res = await this.$http.get(`/global-variables/shippingFees`);
        if (res.status === 200)
          this.$store.dispatch("setShippingFees", res.data.shippingFees);
        else throw new Error("fail");
      }
      if (!this.$store.getters.facePrice) {
        res = await this.$http.get(`/global-variables/facePrice`);
        if (res.status === 200)
          this.$store.dispatch("setFacePrice", res.data.facePrice);
        else throw new Error("fail");
      }

      this.modifiedCustomGeneralProducts = JSON.parse(
        JSON.stringify(this.customGeneralProducts)
      );
      this.modifiedNonCustomGeneralProducts = JSON.parse(
        JSON.stringify(this.nonCustomGeneralProducts)
      );
      this.modifiedShippingFees = JSON.parse(JSON.stringify(this.shippingFees));
      this.modifiedFacePrice = this.facePrice;

      this.dataFetched = true;
    } catch (err) {
      err;
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
  background-image: url("~@/assets/sketch-texture.jpg") !important;
  background-repeat: repeat;
  background-size: 400px 400px;
  background-color: black !important;
  border-radius: 10px !important;
}
</style>
