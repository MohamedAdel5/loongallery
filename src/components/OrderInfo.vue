<template>
  <v-container v-if="dataFetched">
    <v-row class="d-flex justify-start">
      <v-col cols="12">
        <v-form v-model="valid" ref="form" :key="$root.$i18n.locale">
          <v-container
            class="my-2"
            style="border: solid 1px grey; border-radius: 5px"
          >
            <v-text-field
              v-model="name"
              :label="$t('name')"
              :rules="nameRules"
            ></v-text-field>
          </v-container>
          <v-container
            class="my-2"
            style="border: solid 1px grey; border-radius: 5px"
          >
            <v-label>{{ $t("phone_number") }}</v-label>
            <template v-if="isLoggedIn">
              <v-combobox
                v-if="isLoggedIn"
                v-model="phone1"
                :items="userPhoneNumbers"
                :rules="mainPhoneRules"
                @input.native="updateComboboxValue($event, 'phone1')"
                prefix="+2"
                placeholder="011122333"
                :label="$t('phone1')"
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
                :label="$t('phone2')"
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
                :label="$t('phone3')"
                dense
                class="my-4"
              ></v-combobox>
            </template>
            <template v-else>
              <v-text-field
                v-model="phone1"
                :label="$t('phone1')"
                prefix="+2"
                placeholder="011122333"
                :rules="mainPhoneRules"
              ></v-text-field>
              <v-text-field
                v-model="phone2"
                :label="$t('phone2')"
                prefix="+2"
                placeholder="01001116777"
                :rules="phoneRules"
              ></v-text-field>
              <v-text-field
                v-model="phone3"
                :label="$t('phone3')"
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
              :label="$t('select_shipping_method')"
              :rules="shippingMethodRules"
            />

            <v-select
              v-if="shippingMethod === 1"
              :label="$t('select_metro_station')"
              v-model="metroStation"
              :items="getMetroStations()"
              :rules="metroStationRules"
            />

            <template v-if="shippingMethod === 0">
              <h2 class="font-weight-light">{{ $t("address") }}</h2>
              <template v-if="isLoggedIn">
                <v-label>{{ $t("select_address") }}</v-label>
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
                <v-label>{{ $t("or_write_new_address") }}</v-label>
                <p class="caption">
                  {{ $t("address_note") }}
                </p>
                <v-textarea
                  v-model="address"
                  filled
                  :label="$t('address_placeholder')"
                  rows="4"
                  counter="1000"
                  :rules="addressRules"
                ></v-textarea>
                <v-text-field
                  v-model="city"
                  :disabled="!!chosenAddress"
                  :label="$t('city')"
                ></v-text-field>
                <v-text-field
                  v-model="street"
                  :label="$t('street')"
                ></v-text-field>
                <v-text-field
                  v-model="building"
                  :label="$t('building')"
                ></v-text-field>
                <v-text-field
                  v-model="appartment"
                  :label="$t('appartment')"
                ></v-text-field>
              </template>
            </template>
            <!-- <template v-if="shippingMethod === 2">
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
            </template> -->
          </v-container>
          <v-container>
            <v-row>
              <v-col cols="12">
                <b class="secondary--text">{{ $t("total_price") }}: </b><br />
                <span>{{ totalPrice }} LE</span><br />
                <span> + {{ $t("shipping_fees") }}</span>
                <span v-if="!shippingMethod && shippingMethod !== 0"
                  ><br />{{ $t("choose_shipping_note") }}</span
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
            >{{ $t("confirm_order") }}</v-btn
          >
          <span>{{ message }}</span>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {
  setMetroStationsMixin,
  // setOurLocationsMixin,
  setShippingFeesMixin,
  makeOrderMixin
} from "@/mixins/apiMixins";

export default {
  name: "order-info",
  mixins: [
    setMetroStationsMixin,
    // setOurLocationsMixin,
    setShippingFeesMixin,
    makeOrderMixin
  ],
  data() {
    return {
      dataFetched: false,

      name: "",

      phone1: "",
      phone2: undefined,
      phone3: undefined,

      address: undefined,
      city: undefined,
      street: undefined,
      building: undefined,
      appartment: undefined,
      chosenAddress: "",
      metroStation: undefined,
      receiveLocation: undefined,
      shippingMethod: "",
      // shippingMethods: [],

      metroStations: [],
      metroStations_ar: [],
      // ourLocationsShort: [],
      // ourLocationsLong: [],

      valid: false,
      userPhoneNumbers: undefined,
      userAddresses: undefined,

      message: "",

      orderedSuccessfully: false,

      nameRules: [
        v => !!v || this.$t("name_err1"),
        v =>
          /^[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FF]+[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FF- ]*$|^[a-zA-Z]+[a-zA-Z-' ]*$/.test(
            v
          ) || this.$t("name_err2"),
        v => (v && v.length) <= 50 || this.$t("name_err3")
      ],
      phoneRules: [
        v =>
          v === null ||
          v === undefined ||
          /^$|^(01)[0-9]{9}$/.test(v) ||
          this.$t("phone_err1")
      ],
      mainPhoneRules: [
        v => !!v || this.$t("phone_err2"),
        v => /^(01)[0-9]{9}$/.test(v) || this.$t("phone_err1")
      ],
      addressRules: [v => !!v || this.$t("address_err")],
      metroStationRules: [v => !!v || this.$t("metro_station_err")],
      receiveLocationRules: [v => !!v || this.$t("receive_location_err")],
      shippingMethodRules: [
        v => !!v || v == 0 || this.$t("shipping_method_err")
      ],
      homeAddressRules: [v => v === "" || !!v || this.$t("address_err")]
    };
  },

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
      const shippingFees = this.$store.getters.shippingFees[this.shippingMethod]
        .fees;
      return shippingFees;
    },
    shippingMethods() {
      const shippingMethods = [];
      let i = 0;
      for (let method of this.$store.getters.shippingFees) {
        shippingMethods.push({
          text:
            this.$root.$i18n.locale === "en" ? method.name_en : method.name_ar,
          value: i
        });
        i += 1;
      }
      return shippingMethods;
    }
  },

  methods: {
    confirmOrder: async function() {
      if (this.cartIsEmpty) return;
      this.$refs.form.validate();
      if (!this.valid) {
        return;
      }
      this.message = this.$t("please_wait");
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
        // shippingMethod: this.shortShippingMethod,
        shippingMethod: this.shippingMethod,
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
      let options = { "Content-Type": "multipart/form-data" };
      if (this.isLoggedIn)
        options["headers"] = { Authorization: this.$store.getters.authJwt };
      const result = await this.makeOrder(formData, options);
      if (result) {
        this.$emit("ordered-successfully", "success");
        this.$store.dispatch("emptyCart");
      } else {
        this.$emit("ordered-successfully", "fail");
      }
      this.message = "";
    },
    formatChosenAddress() {
      let address = "";
      switch (this.shippingMethod) {
        case 0:
          address = `التسليم للمنزل. `;
          if (this.chosenAddress.length > 0) {
            address += `${this.chosenAddress}`;
          } else {
            address += `المدينة:${this.city || "لم يذكر"}. 
الشارع:${this.street || "لم يذكر"}. 
العمارة:${this.building || "لم يذكر"}. 
الشقة:${this.appartment || "لم يذكر"}. 
العنوان بالتحديد: ${this.address}.`;
          }
          break;
        case 1:
          address = `التسليم لمحطة المترو ${this.metroStation}. `;
          break;
        case 2:
          address = ` :التسليم من مقر الشركة ${this.receiveLocation}. `;
          break;
      }
      return address;
    },
    updateComboboxValue(input, comboboxIndex) {
      this[comboboxIndex] = input.srcElement.value;
    },
    getMetroStations() {
      if (this.$root.$i18n.locale === "en") return this.metroStations;
      else return this.metroStations_ar;
    }
  },
  mounted: async function() {
    const data = await this.setMetroStations();
    this.metroStations = data.metroStations;
    this.metroStations_ar = data.metroStations_ar;

    // let ourLocations = await this.setOurLocations();
    // this.ourLocationsShort = ourLocations.ourLocationsShort;
    // this.ourLocationsLong = ourLocations.ourLocationsLong;
    await this.setShippingFees();

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

<style scoped></style>
