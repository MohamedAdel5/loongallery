<template>
  <div id="not_found">
    <v-card
      tile
      flat
      color="rgba(0,0,0,0)"
      class="d-flex flex-column justify-center mt-10"
    >
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
  name: "not-found"
};
</script>

<style scoped></style>
