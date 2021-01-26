<template>
  <v-card class="main" light v-if="dataFetched">
    <h2 class="text-center py-10 secondary--text">Edit Profile</h2>
    <v-container class="d-flex flex-column align-content-space-around pa-10">
      <v-container
        class="my-2"
        style="border: solid 1px grey; border-radius: 5px;"
      >
        <v-form v-model="validPhoneNumbers" ref="phoneNumbersForm">
          <v-label>Phone Number</v-label>
          <p class="caption grey--text text--darken-2">
            You can add up to 3 phone numbers to choose one of them when you
            order.
          </p>
          <v-text-field
            v-model="phone1"
            label="First Phone Number [[[Required]]]"
            prefix="+2"
            placeholder="011122333"
            :rules="mainPhoneRules"
          ></v-text-field>
          <v-text-field
            v-model="phone2"
            label="Second Phone Number"
            prefix="+2"
            placeholder="011122333"
            :rules="phoneRules"
          ></v-text-field>
          <v-text-field
            v-model="phone3"
            label="Third Phone Number"
            prefix="+2"
            placeholder="011122333"
            :rules="phoneRules"
          ></v-text-field>
          <v-btn class="my-4" color="secondary" @click="applyPhoneChanges"
            >Submit</v-btn
          >
        </v-form>
      </v-container>
      <v-divider></v-divider>
      <v-divider></v-divider>
      <v-divider></v-divider>
      <v-divider></v-divider>
      <v-container
        class="my-2"
        style="border: solid 1px grey; border-radius: 5px;"
      >
        <v-form v-model="validAddresses" ref="addressesForm">
          <v-label>Addresses</v-label>
          <p class="caption grey--text text--darken-2">
            You can add up to 3 addresses to choose one of them when you order.
          </p>
          <p class="caption">
            Please write in Arabic and add any useful details.
          </p>
          <h3 class="font-weight-regular secondary--text">
            FIRST ADDRESS <span class="red--text">[REQUIRED]</span>
          </h3>
          <p style="border: solid 1px grey; border-radius: 5px;">
            Your first address is: <br />
            {{ this.$store.getters.user.addresses[0] || "Not entered." }}
          </p>
          <v-textarea
            v-model="address1"
            :rules="addressRules"
            filled
            label="Detailed Address For Shipping"
            rows="4"
            counter="1000"
          ></v-textarea>
          <v-text-field v-model="city1" label="City"></v-text-field>
          <v-text-field
            v-model="street1"
            label="Street Name/Number"
          ></v-text-field>
          <v-text-field
            v-model="appartment1"
            label="Appartment/Suite number, ..etc"
            hint="Write your appartment number."
          ></v-text-field>
          <v-divider></v-divider>
          <h3 class="font-weight-regular secondary--text">SECOND ADDRESS</h3>
          <p style="border: solid 1px grey; border-radius: 5px;">
            Your second address is: <br />
            {{ this.$store.getters.user.addresses[1] || "Not entered." }}
          </p>
          <v-textarea
            v-model="address2"
            filled
            label="Detailed Address For Shipping"
            rows="4"
            counter="1000"
          ></v-textarea>
          <v-text-field v-model="city2" label="City"></v-text-field>
          <v-text-field
            v-model="street2"
            label="Street Name/Number"
          ></v-text-field>
          <v-text-field
            v-model="appartment2"
            label="Appartment/Suite number, ..etc"
            hint="Write your appartment number."
          ></v-text-field>
          <v-divider></v-divider>
          <h3 class="font-weight-regular secondary--text">THIRD ADDRESS</h3>
          <p style="border: solid 1px grey; border-radius: 5px;">
            Your third address is: <br />
            {{ this.$store.getters.user.addresses[2] || "Not entered." }}
          </p>
          <v-textarea
            v-model="address3"
            filled
            label="Detailed Address For Shipping"
            rows="4"
            counter="1000"
          ></v-textarea>
          <v-text-field v-model="city3" label="City"></v-text-field>
          <v-text-field
            v-model="street3"
            label="Street Name/Number"
          ></v-text-field>
          <v-text-field
            v-model="appartment3"
            label="Appartment/Suite number, ..etc"
            hint="Write your appartment number."
          ></v-text-field>
          <v-btn class="my-4" color="secondary" @click="applyAddressChanges"
            >Submit</v-btn
          >
        </v-form>
      </v-container>
    </v-container>
    <v-overlay
      z-index="11"
      opacity="0.8"
      v-if="responseResult !== 'none'"
      :value="true"
    >
      <div class="my-10" v-click-outside="closeResponseResultWindow">
        <v-btn icon @click="closeResponseResultWindow">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-alert type="error" v-if="responseResult === 'fail'"
          >Error. Could not Edit. Please try again.</v-alert
        >
        <v-alert type="success" v-if="responseResult === 'success'"
          >Edited successfully.</v-alert
        >
      </div>
    </v-overlay>
  </v-card>
</template>

<script>
import {
  changeAddressMixin,
  changePhoneNumbersMixin
} from "@/mixins/apiMixins";

export default {
  name: "user-edit-profile",
  mixins: [changeAddressMixin, changePhoneNumbersMixin],
  data: () => ({
    dataFetched: false,
    responseResult: "none",

    phone1: "",
    phone2: "",
    phone3: "",

    address1: "",
    address2: "",
    address3: "",
    city1: "",
    city2: "",
    city3: "",
    street1: "",
    street2: "",
    street3: "",
    appartment1: "",
    appartment2: "",
    appartment3: "",

    validAddresses: false,
    validPhoneNumbers: false,
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
    addressRules: [v => !!v || "Address is required"]
  }),
  methods: {
    applyPhoneChanges: async function() {
      this.$refs.phoneNumbersForm.validate();
      if (!this.validPhoneNumbers) return;
      const phoneNumbers = new Set([this.phone1]);
      if (this.phone2) phoneNumbers.add(this.phone2);
      if (this.phone3) phoneNumbers.add(this.phone3);

      this.responseResult = (await this.changePhoneNumbers(phoneNumbers))
        ? "success"
        : "fail";
    },
    applyAddressChanges: async function() {
      this.$refs.addressesForm.validate();
      if (!this.validAddresses) return;

      const addresses = [
        `المدينة:${this.city1 || "لم يذكر"}. 
الشارع:${this.street1 || "لم يذكر"}. 
الشقة:${this.appartment1 || "لم يذكر"}. 
العنوان بالتحديد: ${this.address1}.`
      ];
      if (this.address2) {
        addresses.push(`المدينة:${this.city2 || "لم يذكر"}. 
الشارع:${this.street2 || "لم يذكر"}. 
الشقة:${this.appartment2 || "لم يذكر"}. 
العنوان بالتحديد: ${this.address2}.`);
      }
      if (this.address3) {
        addresses.push(`المدينة:${this.city3 || "لم يذكر"}. 
الشارع:${this.street3 || "لم يذكر"}. 
الشقة:${this.appartment3 || "لم يذكر"}. 
العنوان بالتحديد: ${this.address3}.`);
      }

      this.responseResult = (await this.changeAddress(addresses))
        ? "success"
        : "fail";
    },
    closeResponseResultWindow: function() {
      this.responseResult = "none";
    }
  },
  mounted: async function() {
    this.phone1 = this.$store.getters.user.phoneNumbers[0] || "";
    this.phone2 = this.$store.getters.user.phoneNumbers[1] || "";
    this.phone3 = this.$store.getters.user.phoneNumbers[2] || "";

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
