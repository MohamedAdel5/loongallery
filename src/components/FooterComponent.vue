<template>
  <v-footer absolute padless color="primary white--text" style="z-index: 10">
    <v-col class="text-center" cols="12">
      {{ new Date().getFullYear() }} — All copyrights reserved for
      <strong>Loon Gallery &copy;</strong>
    </v-col>
  </v-footer>
</template>

<script>
export default {
  name: "FooterComponent",
  data() {
    return {};
  }
};
</script>

<style scoped></style>
