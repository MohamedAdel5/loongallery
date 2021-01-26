<template>
  <v-container>
    <v-card class="main d-flex justify-center flex-column mt-10 mb-16">
      <v-card-title class="d-block text-center pt-8 secondary--text"
        ><span class="login">Login</span></v-card-title
      >
      <v-container>
        <v-row class="d-flex justify-center">
          <v-col cols="6">
            <v-form v-model="valid" ref="form">
              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="E-mail"
              ></v-text-field>

              <v-text-field
                v-model="password"
                :rules="passwordRules"
                label="Password"
                :type="showPassword ? 'text' : 'password'"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
              ></v-text-field>

              <v-btn class="my-4" color="secondary" @click="loginSubmit"
                >Login</v-btn
              >
              <v-alert type="error" v-if="loginFail"
                >Wrong email or password</v-alert
              >
            </v-form>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import { adminLoginMixin } from "@/mixins/apiMixins";

export default {
  name: "admin-login",
  mixins: [adminLoginMixin],

  data: () => ({
    valid: false,
    loginFail: null,
    email: "",
    password: "",
    showPassword: false,
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ],
    passwordRules: [
      v => !!v || "Password is required",
      v => v.length > 8 || "Password length must be 8-50 characters"
    ]
  }),

  methods: {
    loginSubmit: async function() {
      this.$refs.form.validate();
      if (this.valid) {
        this.loginFail = !(await this.adminLogin(this.email, this.password));
      }
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
