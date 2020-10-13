<template>
  <v-card class="main mb-16" v-if="dataFetched">
    <h2 class="text-center py-10 secondary--text">
      Customize Your Own Portrait
    </h2>
    <v-container class="d-flex flex-column align-content-space-around pa-10">
      <v-form v-model="valid" ref="form">
        <v-row>
          <v-col cols="10">
            <v-row>
              <p class="font-weight-light secondary--text">
                Upload An Image And Make A Special Order
              </p>
            </v-row>
            <v-row>
              <v-file-input
                :disabled="!addToCartButton"
                dense
                accept="image/*"
                label="Select From Device..."
                @change="selectFile"
              ></v-file-input>
            </v-row>
            <v-row class="pt-6">
              <v-text-field
                :disabled="!addToCartButton"
                v-model="numberOfFaces"
                min="1"
                :rules="numberOfFacesRules"
                type="number"
                label="How many people are in the image?"
                persistent-hint
                hint="If the image does not contain people, write 0"
                dense
              ></v-text-field>
            </v-row>
            <v-row>
              <v-col cols="6" class="d-flex justify-left align-center pa-0">
                <v-label
                  ><span class="dark--text caption"
                    >Choose Drawing Style</span
                  ></v-label
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
                  label="style"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <router-link class=" blue--text" :to="'/drawing-styles-examples'"
                >Show Drawing Styles Examples</router-link
              >
            </v-row>
            <v-row>
              <v-col cols="6" class="d-flex justify-left align-center pa-0">
                <v-label
                  ><span class="dark--text caption"
                    >Choose Size (width x height)cm</span
                  ></v-label
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
                  label="size"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <router-link class=" blue--text" :to="'/preview-sizes'"
                >Preview Sizes</router-link
              >
            </v-row>
            <v-row class="pt-6">
              <v-text-field
                :disabled="!addToCartButton"
                v-model="quantity"
                min="1"
                :rules="quantityRules"
                type="number"
                label="Quantity"
                dense
              ></v-text-field>
            </v-row>
            <v-row class="mt-10">
              <v-col
                cols="12"
                class="d-flex justify-left align-center pa-0"
                sm="6"
              >
                <h4>Price: {{ price }} LE</h4>
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
                  >Add to cart <v-icon>mdi-cart</v-icon></v-btn
                >
                <span v-if="!addToCartButton" class="secondary--text pr-2"
                  >Product is added to your cart!</span
                >
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
              >Make Another Order</v-btn
            >
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: "customized-portraits",
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
      return this.$store.getters.customDrawingStyles;
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
  data: () => ({
    uploadedImage: null, //Visit this page for upload info https://bezkoder.com/vuetify-file-upload/
    drawingStyle: "",
    size: "",
    quantity: 1,
    quantityRules: [v => v >= 1 || "Quantity must be greater than 0"],
    numberOfFaces: 1,
    numberOfFacesRules: [
      v => v === 0 || !!v || "Number of people in the image is required.",
      v => v >= 0 || "People number must be greater than or equal 0"
    ],
    addToCartButton: true,
    valid: false,
    dataFetched: false
  }),
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
        productCategories: ["Custom", this.drawingStyle],
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
    if (Object.keys(this.$store.getters.customGeneralProducts).length === 0) {
      const res = await this.$http.get(`/general-products/custom-products`);

      this.$store.dispatch("setCustomGeneralProducts", res.data.products);
    }

    if (!this.$store.getters.facePrice) {
      const res = await this.$http.get(`/global-variables/facePrice`);

      this.$store.dispatch("setFacePrice", res.data.facePrice);
    }
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
.main {
  background-image: url("~@/assets/sketch-texture.jpg") !important;
  background-repeat: repeat;
  background-size: 400px 400px;
  background-color: black !important;
  border-radius: 10px !important;
}
</style>
