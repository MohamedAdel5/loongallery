<template>
  <v-container class="mb-16">
    <v-card class="main d-flex justify-center flex-column mt-10 mb-16">
      <v-card-title class="d-block text-center pt-8 secondary--text"
        ><span class="signup">Signup</span></v-card-title
      >
      <v-container>
        <v-row class="d-flex justify-center">
          <v-col cols="8">
            <v-form v-model="valid" ref="form">
              <v-text-field
                v-model="name"
                label="Name"
                :rules="nameRules"
              ></v-text-field>
              <v-container
                class="my-2"
                style="border: solid 1px grey; border-radius: 5px;"
              >
                <v-label>Phone Number</v-label>
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
              </v-container>
              <v-container
                class="my-2"
                style="border: solid 1px grey; border-radius: 5px;"
              >
                <v-label class="font-weight-light">Home Address</v-label>
                <p class="caption">
                  Please write in Arabic and add any useful details.
                </p>
                <v-textarea
                  v-model="address"
                  :rules="addressRules"
                  filled
                  label="Detailed Address For Shipping"
                  rows="4"
                  counter="1000"
                ></v-textarea>
                <v-text-field v-model="city" label="City"></v-text-field>
                <v-text-field
                  v-model="street"
                  label="Street Name/Number"
                ></v-text-field>
                <v-text-field
                  v-model="appartment"
                  label="Appartment/Suite number, ..etc"
                  hint="Write your appartment number."
                ></v-text-field>
              </v-container>

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

              <v-text-field
                v-model="passwordCheck"
                :error-messages="passwordCheckErrors"
                label="Rewrite Password"
                :rules="passwordCheckRules"
                :type="showPasswordCheck ? 'text' : 'password'"
                :append-icon="showPasswordCheck ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPasswordCheck = !showPasswordCheck"
              ></v-text-field>

              <v-btn class="my-4" color="secondary" @click="signup"
                >Signup</v-btn
              >
              <v-alert type="error" v-if="signupFail"
                >Could not signup. Please try again.</v-alert
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
  name: "signup",

  data: () => ({
    valid: false,
    signupFail: null,
    name: "",
    phone1: "",
    phone2: "",
    phone3: "",
    address: "",
    city: "",
    street: "",
    appartment: "",
    email: "",
    password: "",
    passwordCheck: "",
    showPassword: false,
    showPasswordCheck: false,
    nameRules: [
      v => !!v || "Name is required",
      v =>
        /^[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FF]+[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FF- ]*$|^[a-zA-Z]+[a-zA-Z-' ]*$/.test(
          v
        ) ||
        "Must use English or Arabic letters and special characters(space, ',  -)",
      v => (v && v.length) <= 50 || "Must not exceed 50 characters"
    ],
    phoneRules: [v => /^$|^(01)[0-9]{9}$/.test(v) || "Wrong phone format"],
    addressRules: [v => !!v || "Address is required"],
    mainPhoneRules: [
      v => !!v || "Phone number is required",
      v => /^(01)[0-9]{9}$/.test(v) || "Wrong phone format"
    ],
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ],
    passwordRules: [
      v => !!v || "Password is required",
      v => v.length > 8 || "Password length must be 8-50 characters"
    ],
    passwordCheckRules: [v => !!v || "Password check is required"]
  }),

  computed: {
    passwordCheckErrors() {
      if (this.passwordCheck !== this.password)
        return ["Passwords don't match"];
      else return [];
    }
  },

  methods: {
    signup: async function() {
      this.$refs.form.validate();
      if (this.valid) {
        try {
          const phoneNumbers = new Set([this.phone1]);
          if (this.phone2) phoneNumbers.add(this.phone2);
          if (this.phone3) phoneNumbers.add(this.phone3);
          const res = await this.$http.post("/authentication/signup", {
            name: this.name,
            phoneNumbers: Array.from(phoneNumbers),
            addresses: [
              `المدينة:${this.city || "لم يذكر"}. 
الشارع:${this.street || "لم يذكر"}. 
الشقة:${this.appartment || "لم يذكر"}. 
العنوان بالتحديد: ${this.address}.`
            ],
            email: this.email,
            password: this.password
          });

          if (res.status === 200) {
            localStorage.setItem("auth_jwt", res.data.token);

            this.$store.dispatch("setUser", res.data.user);
            this.$store.dispatch("setAuthJwt", res.data.token);
            this.$store.dispatch("setLoggedInStatus", true);

            this.$router.push(`/home`);
          } else {
            this.signupFail = true;
          }
        } catch (err) {
          this.signupFail = true;
        }
      }
    }
  },
  beforeMount() {
    if (this.$store.getters.loggedIn) {
      this.$router.push(`/home`);
    }
  }
};
</script>

<style scoped>
.main {
  background-image: url("~@/assets/sketch-texture.jpg") !important;
  background-repeat: repeat;
  background-size: 400px 400px;
  /* background-color: black !important; */
  border-radius: 10px !important;
}
.signup {
  font-family: "Advent Pro";
  font-size: 40px;
  font-weight: bolder;
}
</style>
