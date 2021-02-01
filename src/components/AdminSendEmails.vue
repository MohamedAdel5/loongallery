<template>
  <v-card class="main" light v-if="dataFetched">
    <h2 class="text-center py-10 secondary--text">
      {{ $t("email_broadcasting") }}
    </h2>
    <v-container class="d-flex flex-column align-content-space-around pa-10">
      <v-row>
        <v-col cols="12">
          <v-form v-model="valid" ref="form" :key="$root.$i18n.locale">
            <p class="pb-4 secondary--text">
              {{ $t("email_note") }}
            </p>
            <v-row cols="6">
              <v-text-field
                :rules="emailRules"
                v-model="emailSubject"
                :label="$t('email_subject')"
              ></v-text-field>
            </v-row>
            <v-row>
              <v-textarea
                v-model="emailContent"
                filled
                :label="$t('email_content')"
                rows="9"
                :rules="emailRules"
              ></v-textarea>
            </v-row>

            <v-row class="mt-10">
              <v-col cols="12" class="pa-0" sm="6">
                <v-btn @click="broadcast" max-width="200px" color="success">{{
                  $t("send_to_all")
                }}</v-btn
                ><span>{{ message }}</span>
              </v-col>
            </v-row>
            <v-row class="mt-10">
              <v-col cols="12" class="pa-0" sm="6">
                <v-alert type="error" v-if="responseResult === 'fail'">{{
                  $t("email_fail")
                }}</v-alert>
                <v-alert type="success" v-if="responseResult === 'success'">{{
                  $t("email_success")
                }}</v-alert>
              </v-col>
            </v-row>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import emailBroadcastMixin from "@/mixins/apiMixins";

export default {
  name: "admin-send-emails",
  mixins: [emailBroadcastMixin],
  data() {
    return {
      dataFetched: false,
      valid: false,
      emailRules: [v => !!v || this.$t("email_err1")],
      emailContent: null,
      emailSubject: null,
      responseResult: "none",
      message: ""
    };
  },
  methods: {
    broadcast: async function() {
      this.$refs.form.validate();
      if (!this.valid) {
        return;
      }
      this.message = this.$t("please_wait");
      const body = {
        emailContent: this.emailContent,
        emailSubject: this.emailContent
      };

      this.responseResult = (await this.emailBroadcast(body))
        ? "success"
        : "fail";

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
</style>
