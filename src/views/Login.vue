<template>
  <v-container>
    <v-card class="main d-flex justify-center flex-column mt-10 mb-16">
      <v-card-title class="d-block text-center pt-8 secondary--text"
        ><span class="login">{{ $t("login") }}</span></v-card-title
      >
      <v-container>
        <v-row class="d-flex justify-center">
          <v-col cols="6">
            <v-form v-model="valid" ref="form" :key="$root.$i18n.locale">
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

              <v-btn class="my-4" color="secondary" @click="loginSubmit">{{
                $t("login")
              }}</v-btn>
              <v-alert type="error" v-if="loginFail">{{
                $t("wrong_email_or_pass")
              }}</v-alert>
            </v-form>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import { loginMixin } from "@/mixins/apiMixins";
export default {
  name: "login",
  mixins: [loginMixin],
  data() {
    return {
      valid: false,
      loginFail: null,
      email: "",
      password: "",
      showPassword: false,
      emailRules: [
        v => !!v || this.$t("email_err1"),
        v => /.+@.+\..+/.test(v) || this.$t("email_err2")
      ],
      passwordRules: [
        v => !!v || this.$t("password_err1"),
        v => v.length > 8 || this.$t("password_err2")
      ]
    };
  },

  methods: {
    loginSubmit: async function() {
      this.$refs.form.validate();
      if (this.valid) {
        this.loginFail = !(await this.login(this.email, this.password));
      }
    }
  },
  beforeMount() {
    if (this.$store.getters.loggedIn) {
      this.$router.push(`/home`).catch(() => {});
    }
  }
};
</script>

<style scoped>
.login {
  font-family: "Advent Pro";
  font-size: 30px;
  font-weight: bolder;
}
</style>
