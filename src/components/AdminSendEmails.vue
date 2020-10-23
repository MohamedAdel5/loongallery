<template>
  <v-card class="main" light v-if="dataFetched">
    <h2 class="text-center py-10 secondary--text">Send Email Notifications</h2>
    <v-container class="d-flex flex-column align-content-space-around pa-10">
      <v-row>
        <v-col cols="12">
          <v-form v-model="valid" ref="form">
            <p class="pb-4 secondary--text">
              Write an email to be sent to all users.
            </p>
            <v-row cols="6">
              <v-text-field
                :rules="emailRules"
                v-model="emailSubject"
                label="Email subject"
              ></v-text-field>
            </v-row>
            <v-row>
              <v-textarea
                v-model="emailContent"
                filled
                label="Email content"
                rows="9"
                :rules="emailRules"
              ></v-textarea>
            </v-row>

            <v-row class="mt-10">
              <v-col cols="12" class="pa-0" sm="6">
                <v-btn @click="broadcast" max-width="200px" color="success"
                  >Send to all</v-btn
                ><span>{{ message }}</span>
              </v-col>
            </v-row>
            <v-row class="mt-10">
              <v-col cols="12" class="pa-0" sm="6">
                <v-alert type="error" v-if="responseResult === 'fail'"
                  >Failed to send emails. Please contact the developers
                  team.</v-alert
                >
                <v-alert type="success" v-if="responseResult === 'success'"
                  >Emails are sent successfully.</v-alert
                >
              </v-col>
            </v-row>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: "admin-send-emails",
  data: () => ({
    dataFetched: false,
    valid: false,
    emailRules: [v => !!v || "This field is required!"],
    emailContent: null,
    emailSubject: null,
    responseResult: "none",
    message: ""
  }),
  methods: {
    broadcast: async function() {
      this.$refs.form.validate();
      if (!this.valid) {
        return;
      }
      this.message = "Please wait...";

      try {
        const body = {
          emailContent: this.emailContent,
          emailSubject: this.emailContent
        };
        const res = await this.$http.post(`/emails/broadcast`, body, {
          headers: {
            Authorization: this.$store.getters.adminAuthJwt
          }
        });
        if (res.status === 200) {
          this.responseResult = "success";
        } else this.responseResult = "fail";
      } catch (err) {
        this.responseResult = "fail";
      }
      this.message = "";
    }
  },
  mounted() {
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
.main {
  background-image: url("~@/assets/sketch-texture.jpg") !important;
  background-repeat: repeat;
  background-size: 600px 600px;
  background-color: black !important;
  border-radius: 10px !important;
}
</style>
