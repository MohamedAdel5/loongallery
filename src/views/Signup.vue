<template>
  <v-container class="mb-16">
    <v-card class="main d-flex justify-center flex-column mt-10 mb-16">
      <v-card-title class="d-block text-center pt-8 secondary--text"
        ><span class="signup">{{ $t("signup") }}</span></v-card-title
      >
      <v-container>
        <v-row class="d-flex justify-center">
          <v-col cols="8">
            <!-- a key is added to the form element to make it re-render when the language is switched -->
            <v-form v-model="valid" ref="form" :key="$root.$i18n.locale">
              <v-text-field
                v-model="name"
                :label="$t('name')"
                :rules="nameRules"
              ></v-text-field>
              <v-container
                class="my-2"
                style="border: solid 1px grey; border-radius: 5px;"
              >
                <v-label>{{ $t("phone_number") }}</v-label>
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
              </v-container>
              <v-container
                class="my-2"
                style="border: solid 1px grey; border-radius: 5px;"
              >
                <v-label class="font-weight-light">{{ $t("address") }}</v-label>
                <p class="caption">
                  {{ $t("address_note") }}
                </p>
                <v-textarea
                  v-model="address"
                  :rules="addressRules"
                  filled
                  :label="$t('address_placeholder')"
                  rows="4"
                  counter="1000"
                ></v-textarea>
                <v-text-field v-model="city" :label="$t('city')"></v-text-field>
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
              </v-container>

              <v-text-field
                v-model="email"
                :rules="emailRules"
                :label="$t('email')"
              ></v-text-field>

              <v-text-field
                v-model="password"
                :rules="passwordRules"
                :label="$t('password')"
                :type="showPassword ? 'text' : 'password'"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
              ></v-text-field>

              <v-text-field
                v-model="passwordCheck"
                :error-messages="passwordCheckErrors"
                :label="$t('rewrite_password')"
                :rules="passwordCheckRules"
                :type="showPasswordCheck ? 'text' : 'password'"
                :append-icon="showPasswordCheck ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPasswordCheck = !showPasswordCheck"
              ></v-text-field>

              <v-checkbox
                v-model="agreement"
                :label="$t('agreement')"
              ></v-checkbox>
              <v-btn
                class="my-4"
                color="secondary"
                @click="signupSubmit"
                :disabled="!agreement"
                >{{ $t("signup") }}</v-btn
              >
              <v-alert type="error" v-if="signupFail">{{
                $t("signup_fail")
              }}</v-alert>
            </v-form>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import { signupMixin } from "@/mixins/apiMixins";

export default {
  name: "signup",
  mixins: [signupMixin],
  data() {
    return {
      valid: false,
      signupFail: null,
      name: "",
      phone1: "",
      phone2: "",
      phone3: "",
      address: "",
      city: "",
      street: "",
      building: "",
      appartment: "",
      email: "",
      password: "",
      passwordCheck: "",
      showPassword: false,
      showPasswordCheck: false,

      agreement: false
    };
  },

  computed: {
    passwordCheckErrors() {
      if (this.passwordCheck !== this.password)
        return ["Passwords don't match"];
      else return [];
    },
    nameRules() {
      return [
        v => !!v || this.$t("name_err1"),
        v =>
          /^[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FF]+[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FF- ]*$|^[a-zA-Z]+[a-zA-Z-' ]*$/.test(
            v
          ) || this.$t("name_err2"),
        v => (v && v.length) <= 50 || this.$t("name_err3")
      ];
    },
    phoneRules() {
      return [v => /^$|^(01)[0-9]{9}$/.test(v) || this.$t("phone_err1")];
    },
    addressRules() {
      return [v => !!v || this.$t("address_err")];
    },
    mainPhoneRules() {
      return [
        v => !!v || this.$t("phone_err2"),
        v => /^(01)[0-9]{9}$/.test(v) || this.$t("phone_err1")
      ];
    },
    emailRules() {
      return [
        v => !!v || this.$t("email_err1"),
        v => /.+@.+\..+/.test(v) || this.$t("email_err2")
      ];
    },
    passwordRules() {
      return [
        v => !!v || this.$t("password_err1"),
        v => v.length > 8 || this.$t("password_err2")
      ];
    },
    passwordCheckRules() {
      return [v => !!v || this.$t("password_err3")];
    }
  },

  methods: {
    signupSubmit: async function() {
      this.$refs.form.validate();
      if (this.valid) {
        const phoneNumbers = new Set([this.phone1]);
        if (this.phone2) phoneNumbers.add(this.phone2);
        if (this.phone3) phoneNumbers.add(this.phone3);
        const newUserObject = {
          name: this.name,
          phoneNumbers: Array.from(phoneNumbers),
          addresses: [
            `المدينة:${this.city || "لم يذكر"}. 
الشارع:${this.street || "لم يذكر"}. 
العمارة:${this.building || "لم يذكر"}. 
الشقة:${this.appartment || "لم يذكر"}. 
العنوان بالتحديد: ${this.address}.`
          ],
          email: this.email,
          password: this.password
        };

        this.signupFail = !(await this.signup(newUserObject));
      }
    }
  },
  beforeMount() {
    if (this.$store.getters.loggedIn) {
      this.$router.push(`/home`).catch(() => {});
    }
  },
  mounted() {}
};
</script>

<style scoped>
.signup {
  font-family: "Advent Pro";
  font-size: 40px;
  font-weight: bolder;
}
</style>
