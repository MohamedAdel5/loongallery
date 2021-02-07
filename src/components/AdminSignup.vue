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
              <v-radio-group v-model="authority">
                <v-radio :label="'primary admin'" :value="'primary'"></v-radio>
                <v-radio :label="'designer'" :value="'designer'"></v-radio>
                <v-radio :label="'manager'" :value="'manager'"></v-radio>
                <v-radio :label="'social'" :value="'social'"></v-radio>
              </v-radio-group>
              <v-btn class="my-4" color="secondary" @click="signupSubmit">{{
                $t("signup")
              }}</v-btn>
              <v-alert type="error" v-if="signupFail">{{
                $t("signup_fail")
              }}</v-alert>
              <v-alert type="success" v-if="signupSuccess">{{
                $t("save_success")
              }}</v-alert>
            </v-form>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import { adminSignupMixin, signupMixin } from "@/mixins/apiMixins";

export default {
  name: "admin-signup",
  mixins: [adminSignupMixin, signupMixin],
  data() {
    return {
      valid: false,
      signupFail: null,
      signupSuccess: null,

      name: "",
      email: "",
      password: "",
      passwordCheck: "",
      showPassword: false,
      showPasswordCheck: false,

      authority: null
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
        let newAdminObject;
        if (this.authority === "social") {
          newAdminObject = {
            name: this.name,
            phoneNumbers: ["01111111111"],
            addresses: [`dummy address`],
            email: this.email,
            password: this.password,
            isSocialAdmin: true
          };
          this.signupFail = !(await this.signup(newAdminObject));
        } else {
          newAdminObject = {
            name: this.name,
            email: this.email,
            password: this.password,
            authority: this.authority
          };
          this.signupFail = !(await this.adminSignup(newAdminObject));
        }

        this.signupSuccess = !this.signupFail;
      }
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
