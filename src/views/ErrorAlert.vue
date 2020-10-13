<template>
  <div id="not_found">
    <v-card class="d-flex flex-column justify-center mt-10 main">
      <v-row class="d-flex justify-center">
        <v-card-title class="secondary--text"
          >We are sorry, there is a fatal error. Please try again.</v-card-title
        >
        <p class="secondary--text">Or contact us if you couldn't fix this.</p>
        <p class="secondary--text">
          Our contact info is down below at the footer.
        </p>
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
