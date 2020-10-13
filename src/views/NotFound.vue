<template>
  <div id="not_found">
    <v-card class="d-flex flex-column justify-center mt-10 main">
      <v-row class="d-flex justify-center">
        <v-card-title class="secondary--text"
          >404 - Page not found.</v-card-title
        >
      </v-row>
      <v-row class="d-flex justify-center">
        <v-card-actions>
          <router-link to="/" class="mt-10 secondary--text"
            >Back to home</router-link
          >
        </v-card-actions>
      </v-row>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "NotFound"
};
</script>

<style scoped>
.main {
  background-image: url("~@/assets/black-wall-texture.png") !important;
  background-repeat: repeat;
  background-color: black;
}
</style>
