<template>
  <v-container v-if="dataFetched">
    <v-row class="d-flex justify-start">
      <v-col cols="12">
        <v-form v-model="valid" ref="form">
          <v-container
            class="my-2"
            style="border: solid 1px grey; border-radius: 5px"
          >
            <v-text-field
              v-model="name"
              label="Name"
              :rules="nameRules"
            ></v-text-field>
          </v-container>
          <v-container
            class="my-2"
            style="border: solid 1px grey; border-radius: 5px"
          >
            <v-label>Phone Number</v-label>
            <template v-if="isLoggedIn">
              <v-combobox
                v-if="isLoggedIn"
                v-model="phone1"
                :items="userPhoneNumbers"
                :rules="mainPhoneRules"
                @input.native="updateComboboxValue($event, 'phone1')"
                prefix="+2"
                placeholder="011122333"
                label="First Phone Number(Required)"
                dense
                class="my-4"
              ></v-combobox>
              <v-combobox
                v-if="isLoggedIn"
                v-model="phone2"
                :items="userPhoneNumbers"
                :rules="phoneRules"
                @input.native="updateComboboxValue($event, 'phone2')"
                prefix="+2"
                placeholder="011122333"
                label="Second Phone Number"
                dense
                class="my-4"
              ></v-combobox>
              <v-combobox
                v-if="isLoggedIn"
                v-model="phone3"
                :items="userPhoneNumbers"
                :rules="phoneRules"
                @input.native="updateComboboxValue($event, 'phone3')"
                prefix="+2"
                placeholder="011122333"
                label="Third Phone Number"
                dense
                class="my-4"
              ></v-combobox>
            </template>
            <template v-else>
              <v-text-field
                v-model="phone1"
                label="First Phone Number (Required)"
                prefix="+2"
                placeholder="011122333"
                :rules="mainPhoneRules"
              ></v-text-field>
              <v-text-field
                v-model="phone2"
                label="Second Phone Number"
                prefix="+2"
                placeholder="01001116777"
                :rules="phoneRules"
              ></v-text-field>
              <v-text-field
                v-model="phone3"
                label="Third Phone Number"
                prefix="+2"
                placeholder="01227799000"
                :rules="phoneRules"
              ></v-text-field>
            </template>
          </v-container>
          <v-container
            class="my-2"
            style="border: solid 1px grey; border-radius: 5px"
          >
            <v-select
              v-model="shippingMethod"
              :items="shippingMethods"
              :menu-props="{ maxHeight: '400' }"
              label="Select A Shipping Method"
              :rules="shippingMethodRules"
            />

            <v-select
              v-if="shippingMethod === 'To A Metro Station'"
              label="Select A Metro Station."
              v-model="metroStation"
              :items="metroStations"
              :rules="metroStationRules"
            />

            <template v-if="shippingMethod === 'To Home'">
              <h2 class="font-weight-light">Home Address</h2>
              <template v-if="isLoggedIn">
                <v-label>Choose an existing address</v-label>
                <v-select
                  v-if="isLoggedIn"
                  v-model="chosenAddress"
                  :items="userAddresses"
                  label=""
                  dense
                  :rules="homeAddressRules"
                ></v-select>
              </template>
              <template v-if="!chosenAddress">
                <v-label>Or write a new address</v-label>
                <p class="caption">
                  Please write in Arabic and add any useful details.
                </p>
                <v-textarea
                  v-model="address"
                  filled
                  label="Detailed Shipping Address"
                  rows="4"
                  counter="1000"
                  :rules="addressRules"
                ></v-textarea>
                <v-text-field
                  v-model="city"
                  :disabled="!!chosenAddress"
                  label="City"
                ></v-text-field>
                <v-text-field
                  v-model="street"
                  label="Street Name/Number"
                ></v-text-field>
                <v-text-field
                  v-model="appartment"
                  label="Appartment/Suite number, ..etc"
                  hint="Write your appartment number."
                ></v-text-field>
              </template>
            </template>
            <template
              v-if="
                shippingMethod ===
                  'Receive It From Our Location (No Shipping Fees)'
              "
            >
              <v-select
                label="Select One Of Our Locations"
                v-model="receiveLocation"
                :items="ourLocationsShort"
                :rules="receiveLocationRules"
              />
              <p v-if="receiveLocation">
                {{
                  ourLocationsLong[ourLocationsShort.indexOf(receiveLocation)]
                }}
              </p>
            </template>
          </v-container>
          <v-container>
            <v-row>
              <v-col cols="12">
                <b class="secondary--text">Total Price: </b>
                <span>{{ totalPrice }} LE + Shipping Fees</span>
                <span v-if="!shippingMethod"
                  ><br />Choose a shipping method to show shipping fees</span
                >
                <span v-else
                  >({{ shippingFees }} LE) =
                  {{ totalPrice + shippingFees }} LE</span
                >
              </v-col>
            </v-row>
          </v-container>
          <v-btn
            class="my-4"
            color="secondary"
            :disabled="cartIsEmpty"
            @click="confirmOrder"
            >Confirm Order</v-btn
          >
          <span>{{ message }}</span>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "order-info",

  data: () => ({
    dataFetched: false,

    name: "",

    phone1: "",
    phone2: undefined,
    phone3: undefined,

    address: undefined,
    city: undefined,
    street: undefined,
    appartment: undefined,
    chosenAddress: "",
    metroStation: undefined,
    receiveLocation: undefined,
    shippingMethod: "",
    shippingMethods: [
      "To Home",
      "To A Metro Station",
      "Receive It From Our Location (No Shipping Fees)"
    ],

    metroStations: [],
    ourLocationsShort: [],
    ourLocationsLong: [],

    valid: false,
    userPhoneNumbers: undefined,
    userAddresses: undefined,

    message: "",

    orderedSuccessfully: false,

    nameRules: [
      v => !!v || "Name is required",
      v =>
        /^[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FF]+[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FF- ]*$|^[a-zA-Z]+[a-zA-Z-' ]*$/.test(
          v
        ) ||
        "Must use English or Arabic letters and special characters(space, ',  -)",
      v => (v && v.length) <= 50 || "Must not exceed 50 characters"
    ],
    phoneRules: [
      v =>
        v === null ||
        v === undefined ||
        /^$|^(01)[0-9]{9}$/.test(v) ||
        "Wrong phone format"
    ],
    mainPhoneRules: [
      v => !!v || "Phone number is required",
      v => /^(01)[0-9]{9}$/.test(v) || "Wrong phone format"
    ],
    addressRules: [v => !!v || "Address is required"],
    metroStationRules: [v => !!v || "You have to choose a metro station"],
    receiveLocationRules: [v => !!v || "You have to choose a receive location"],
    shippingMethodRules: [v => !!v || "You have to choose a shipping method"],
    homeAddressRules: [
      v => v === "" || !!v || "You have to choose a home address"
    ]
  }),

  computed: {
    isLoggedIn() {
      return this.$store.getters.loggedIn;
    },
    user() {
      //if logged in
      return this.$store.getters.user;
    },
    cartIsEmpty() {
      return this.$store.getters.cart.length === 0;
    },
    totalPrice() {
      let total = 0;
      this.$store.getters.cart.forEach(product => {
        total += product.price;
      });
      return total;
    },
    shippingFees() {
      const shippingFees = this.$store.getters.shippingFees;
      return this.shippingMethod === "To Home"
        ? shippingFees.home
        : this.shippingMethod === "To A Metro Station"
        ? shippingFees.metro
        : shippingFees.ourLocation;
    },
    shortShippingMethod() {
      return this.shippingMethod === "To Home"
        ? "home"
        : this.shippingMethod === "To A Metro Station"
        ? "metro"
        : "ourLocation";
    }
  },

  methods: {
    confirmOrder: async function() {
      if (this.cartIsEmpty) return;
      this.$refs.form.validate();
      if (!this.valid) {
        return;
      }
      this.message = "Please wait...";
      const customerName = this.name;

      //Remove duplicates if exist
      const customerPhoneNumbers = new Set([this.phone1]);
      if (this.phone2) customerPhoneNumbers.add(this.phone2);
      if (this.phone3) customerPhoneNumbers.add(this.phone3);

      const customerAddress = this.formatChosenAddress();

      const order = {
        customerName,
        customerPhoneNumbers: Array.from(customerPhoneNumbers),
        customerAddress,
        shippingMethod: this.shortShippingMethod,
        products: JSON.parse(JSON.stringify(this.$store.getters.cart))
      };
      if (this.isLoggedIn) order.userID = this.$store.getters.user._id;

      let formData = new FormData();
      for (let i = 0; i < this.$store.getters.cart.length; i++) {
        const product = this.$store.getters.cart[i];
        const image = product.image;
        //if custom product
        if (!product.productID) {
          formData.append(`image_${i}`, image);
          delete order.products[i].image;
        }
      }
      formData.append("body", JSON.stringify(order));

      try {
        let options = { "Content-Type": "multipart/form-data" };
        if (this.isLoggedIn)
          options["headers"] = { Authorization: this.$store.getters.authJwt };
        const res = await this.$http.post(`/orders`, formData, options);
        if (res.status === 200) {
          this.message = "";
          this.$emit("ordered-successfully", "success");
          this.$store.dispatch("emptyCart");
        } else {
          this.message = "";
          throw new Error("fail");
          // this.$store.dispatch("emptyCart");
        }
      } catch (err) {
        this.message = "";
        this.$emit("ordered-successfully", "fail");
      }
    },
    formatChosenAddress() {
      let address = "";
      switch (this.shippingMethod) {
        case "To Home":
          address = `التسليم للمنزل. `;
          if (this.chosenAddress.length > 0) {
            address += `${this.chosenAddress}`;
          } else {
            address += `المدينة:${this.city || "لم يذكر"}. 
الشارع:${this.street || "لم يذكر"}. 
الشقة:${this.appartment || "لم يذكر"}. 
العنوان بالتحديد: ${this.address}.`;
          }
          break;
        case "To A Metro Station":
          address = `التسليم لمحطة المترو ${this.metroStation}. `;
          break;
        case "Receive It From Our Location (No Shipping Fees)":
          address = ` :التسليم من مقر الشركة ${this.receiveLocation}. `;
          break;
      }
      return address;
    },
    updateComboboxValue(input, comboboxIndex) {
      this[comboboxIndex] = input.srcElement.value;
    }
  },
  mounted: async function() {
    try {
      let res;
      res = await this.$http.get(`/global-variables/metroStations`);
      if (res.status === 200) this.metroStations = res.data.metroStations;
      else throw new Error("fail");

      res = await this.$http.get(`/global-variables/ourLocations`);
      if (res.status === 200) {
        this.ourLocationsShort = res.data.ourLocations.map(
          location => location.short
        );
        this.ourLocationsLong = res.data.ourLocations.map(
          location => location.long
        );
      } else throw new Error("fail");

      if (Object.keys(this.$store.getters.shippingFees).length === 0) {
        res = await this.$http.get(`/global-variables/shippingFees`);
        if (res.status === 200)
          this.$store.dispatch("setShippingFees", res.data.shippingFees);
        else throw new Error("fail");
      }
    } catch (err) {
      err;
    }

    if (this.isLoggedIn) {
      //Get the user's phone numbers and addresses and assign them to phone1, phone2, phone3 and addresses
      this.userPhoneNumbers = this.user.phoneNumbers;
      this.userAddresses = [...this.user.addresses];
      this.userAddresses.unshift(""); //Add an empty element
      this.name = this.user.name;
    }

    this.dataFetched = true;
  }
};
</script>

<style scoped>
.main {
  background-image: url("~@/assets/sketch-texture.png") !important;
  background-repeat: repeat;
  background-size: 600px 600px;
  /* background-color: black !important; */
  border-radius: 10px !important;
}
</style>
