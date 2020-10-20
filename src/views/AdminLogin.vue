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

              <v-btn class="my-4" color="secondary" @click="login">Login</v-btn>
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
export default {
  name: "admin-login",

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
    login: async function() {
      this.$refs.form.validate();
      if (this.valid) {
        try {
          const res = await this.$http.post("/authentication/admin-login", {
            email: this.email,
            password: this.password
          });

          if (res.status === 200) {
            sessionStorage.setItem("admin_auth_jwt", res.data.token);

            this.$store.dispatch("setAdmin", res.data.user);
            this.$store.dispatch("setAdminAuthJwt", res.data.token);
            this.$store.dispatch("setAdminLoggedInStatus", true);
            this.$router.push(`/6324789123/admin`);
          } else {
            this.loginFail = true;
          }
        } catch (err) {
          // console.log(err);
          this.loginFail = true;
        }
      }
    }
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
.login {
  font-family: "Advent Pro";
  font-size: 30px;
  font-weight: bolder;
}
</style>
