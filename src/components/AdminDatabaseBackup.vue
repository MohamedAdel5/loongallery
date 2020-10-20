<template>
  <v-card class="main" light v-if="dataFetched">
    <h2 class="text-center py-10 secondary--text">Database backup</h2>
    <v-container>
      <v-row>
        <v-col cols="12" class="d-flex justify-center">
          <p>
            Please note that doing multiple backups would eventually affect your
            storage size on the server side.
          </p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="d-flex justify-center">
          <v-btn @click="getBackup" class="secondary">Backup now</v-btn>
        </v-col>
        <v-col cols="12">
          <v-alert v-if="responseResult === 'success'" type="success"
            >Downloaded successfully</v-alert
          >
          <v-alert v-if="responseResult === 'fail'" type="error"
            >Could Not backup. Please contact the developers team as soon as
            possible.</v-alert
          >
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: "admin-edit-prices",
  data: () => ({
    dataFetched: false,
    responseResult: "none"
  }),
  methods: {
    forceFileDownload(response) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const title = `backup-${Date.now()}.archive`;
      link.setAttribute("download", title);
      document.body.appendChild(link);
      link.click();
    },
    getBackup: function() {
      const url = "/database-backup";
      this.$http({
        method: "get",
        url,
        responseType: "arraybuffer",
        headers: { Authorization: this.$store.getters.adminAuthJwt }
      })
        .then(response => {
          this.forceFileDownload(response);
          this.responseResult = "success";
        })
        .catch(() => (this.responseResult = "fail"));
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
  background-image: url("~@/assets/sketch-texture.png") !important;
  background-repeat: repeat;
  background-size: 600px 600px;
  background-color: black !important;
  border-radius: 10px !important;
}
</style>
