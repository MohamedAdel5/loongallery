<template>
  <v-card class="main mb-16" v-if="dataFetched">
    <h2 class="text-center py-10 secondary--text">
      Customize Your Own Portrait
    </h2>
    <v-container class="d-flex flex-column align-content-space-around pa-10">
      <v-form v-model="valid" ref="form">
        <v-row>
          <v-col cols="10">
            <v-row
              style="border: solid 1px grey; border-radius: 5px; color: rgba(50, 46, 46, 0.87)"
            >
              <v-col cols="12">
                <v-container>
                  <p>
                    - Please follow the following rules before uploading your
                    image:<br />
                  </p>
                  <ol>
                    <li>
                      Upload a good quality image that shows all important
                      features.
                    </li>
                    <li>The image format has to be jpg/jpeg or png</li>
                    <li>
                      In case of choosing wood carving, upload an image that
                      contains the text you would like to have on the
                      product(Name/Date/Quote).
                    </li>
                  </ol>
                </v-container>
                <v-divider></v-divider>
                <v-container>
                  <p>
                    - Please read the section underneath this page to find
                    details about our products materials and our delivery times.
                  </p>
                </v-container>
              </v-col>
            </v-row>
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
      <v-divider></v-divider>
      <v-row style="border: solid 1px grey; border-radius: 5px" class="mt-10">
        <v-container>
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
  background-size: 600px 600px;
  background-color: black !important;
  border-radius: 10px !important;
}
</style>
