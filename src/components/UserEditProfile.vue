<template>
  <v-card class="main" light v-if="dataFetched">
    <h2 class="text-center py-10 secondary--text">{{ $t("edit_profile") }}</h2>
    <v-container class="d-flex flex-column align-content-space-around pa-10">
      <v-container
        class="my-2"
        style="border: solid 1px grey; border-radius: 5px;"
      >
        <v-form
          v-model="validPhoneNumbers"
          ref="phoneNumbersForm"
          :key="$root.$i18n.locale"
        >
          <v-label>{{ $t("phone_number") }}</v-label>
          <p class="caption grey--text text--darken-2">
            {{ $t("phone_numbers_note") }}
          </p>
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
            placeholder="011122333"
            :rules="phoneRules"
          ></v-text-field>
          <v-text-field
            v-model="phone3"
            :label="$t('phone3')"
            prefix="+2"
            placeholder="011122333"
            :rules="phoneRules"
          ></v-text-field>
          <v-btn class="my-4" color="secondary" @click="applyPhoneChanges">{{
            $t("submit")
          }}</v-btn>
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
          <v-label>{{ $t("address") }}</v-label>
          <p class="caption grey--text text--darken-2">
            {{ $t("addresses_note") }}
          </p>
          <p class="caption">
            {{ $t("address_note") }}
          </p>
          <h3 class="font-weight-regular secondary--text">
            {{ $t("address1") }}
          </h3>
          <p style="border: solid 1px grey; border-radius: 5px;">
            {{ this.$store.getters.user.addresses[0] || $t("not_entered") }}
          </p>
          <v-textarea
            v-model="address1"
            :rules="addressRules"
            filled
            :label="$t('address_placeholder')"
            rows="4"
            counter="1000"
          ></v-textarea>
          <v-text-field v-model="city1" :label="$t('city')"></v-text-field>
          <v-text-field v-model="street1" :label="$t('street')"></v-text-field>
          <v-text-field
            v-model="building1"
            :label="$t('building')"
          ></v-text-field>
          <v-text-field
            v-model="appartment1"
            :label="$t('appartment')"
          ></v-text-field>
          <v-divider></v-divider>
          <h3 class="font-weight-regular secondary--text">
            {{ $t("address2") }}
          </h3>
          <p style="border: solid 1px grey; border-radius: 5px;">
            {{ this.$store.getters.user.addresses[1] || $t("not_entered") }}
          </p>
          <v-textarea
            v-model="address2"
            filled
            :label="$t('address_placeholder')"
            rows="4"
            counter="1000"
          ></v-textarea>
          <v-text-field v-model="city2" :label="$t('city')"></v-text-field>
          <v-text-field v-model="street2" :label="$t('street')"></v-text-field>
          <v-text-field
            v-model="building2"
            :label="$t('building')"
          ></v-text-field>
          <v-text-field
            v-model="appartment2"
            :label="$t('appartment')"
          ></v-text-field>
          <v-divider></v-divider>
          <h3 class="font-weight-regular secondary--text">
            {{ $t("address3") }}
          </h3>
          <p style="border: solid 1px grey; border-radius: 5px;">
            {{ this.$store.getters.user.addresses[2] || $t("not_entered") }}
          </p>
          <v-textarea
            v-model="address3"
            filled
            :label="$t('address_placeholder')"
            rows="4"
            counter="1000"
          ></v-textarea>
          <v-text-field v-model="city3" :label="$t('city')"></v-text-field>
          <v-text-field v-model="street3" :label="$t('street')"></v-text-field>
          <v-text-field
            v-model="building3"
            :label="$t('building')"
          ></v-text-field>
          <v-text-field
            v-model="appartment3"
            :label="$t('appartment')"
          ></v-text-field>
          <v-btn class="my-4" color="secondary" @click="applyAddressChanges">{{
            $t("submit")
          }}</v-btn>
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
        <v-alert type="error" v-if="responseResult === 'fail'">{{
          $t("edit_err")
        }}</v-alert>
        <v-alert type="success" v-if="responseResult === 'success'">{{
          $t("edit_success")
        }}</v-alert>
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
  data() {
    return {
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
      building1: "",
      building2: "",
      building3: "",
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
          this.$t("phone_err1")
      ],
      mainPhoneRules: [
        v => !!v || this.$t("phone_err2"),
        v => /^(01)[0-9]{9}$/.test(v) || this.$t("phone_err1")
      ],
      addressRules: [v => !!v || this.$t("address_err")]
    };
  },
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
العمارة:${this.building1 || "لم يذكر"}. 
الشقة:${this.appartment1 || "لم يذكر"}. 
العنوان بالتحديد: ${this.address1}.`
      ];
      if (this.address2) {
        addresses.push(`المدينة:${this.city2 || "لم يذكر"}. 
الشارع:${this.street2 || "لم يذكر"}. 
العمارة:${this.building2 || "لم يذكر"}. 
الشقة:${this.appartment2 || "لم يذكر"}. 
العنوان بالتحديد: ${this.address2}.`);
      }
      if (this.address3) {
        addresses.push(`المدينة:${this.city3 || "لم يذكر"}. 
الشارع:${this.street3 || "لم يذكر"}. 
العمارة:${this.building3 || "لم يذكر"}. 
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
