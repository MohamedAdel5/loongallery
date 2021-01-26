<template>
  <v-card>
    <v-img
      :src="imageSrc"
      :height="imageSize"
      :width="imageSize"
      alt="Portrait"
    />
    <h3 class="text-center subtitle-1 font-weight-black">{{ title }}</h3>
    <h4 class="text-center subtitle-2 font-weight-thin">
      {{ calculatePriceRange() }} LE
    </h4>
  </v-card>
</template>

<script>
export default {
  name: "product-card",
  props: ["imageSrc", "title", "prices"],
  data() {
    return {
      imageSize: `${process.env.VUE_APP_PRODUCT_IMAGE_SIZE}px`
    };
  },
  methods: {
    calculatePriceRange: function() {
      if (this.prices.length > 1) {
        return `${this.prices[0]} - ${this.prices[this.prices.length - 1]}`;
      } else {
        return `${this.prices[0]}`;
      }
    }
  }
};
</script>

<style scoped></style>
