<template>
  <v-card class="main" light v-if="dataFetched">
    <h2 class="text-center py-10 secondary--text">
      {{ $t("database_backup") }}
    </h2>
    <v-container>
      <v-row>
        <v-col cols="12" class="d-flex justify-center">
          <p>
            {{ $t("backup_note") }}
          </p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="d-flex justify-center">
          <v-btn @click="getBackup" class="secondary">{{ $t("backup") }}</v-btn>
        </v-col>
        <v-col cols="12">
          <v-alert v-if="responseResult === 'success'" type="success">{{
            $t("save_success")
          }}</v-alert>
          <v-alert v-if="responseResult === 'fail'" type="error">{{
            $t("save_fail")
          }}</v-alert>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import { backupMixin } from "@/mixins/apiMixins";
export default {
  name: "admin-database-backup",
  mixins: [backupMixin],
  data() {
    return {
      dataFetched: false,
      responseResult: "none"
    };
  },
  methods: {
    forceFileDownload(response) {
      const fileName = response.headers["content-disposition"].match(
        /filename="(.+)"/
      )[1];
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const title = fileName;
      link.setAttribute("download", title);
      document.body.appendChild(link);
      link.click();
    },
    getBackup: async function() {
      const response = await this.backup();
      if (response) {
        this.forceFileDownload(response);
        this.responseResult = "success";
      } else {
        this.responseResult = "fail";
      }

      // this.$http({
      //   method: "get",
      //   url: "/database-backup",
      //   responseType: "arraybuffer",
      //   headers: { Authorization: this.$store.getters.adminAuthJwt }
      // })
      //   .then(response => {
      //     this.forceFileDownload(response);
      //     this.responseResult = "success";
      //   })
      //   .catch(() => (this.responseResult = "fail"));
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
