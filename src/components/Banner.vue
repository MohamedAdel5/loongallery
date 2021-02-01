<template>
  <div class="banner">
    <div class="banner-overlay">
      <v-img
        :src="require('@/assets/logo.jpg')"
        max-height="200px"
        max-width="200px"
        class="logo"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "Banner",

  data() {
    return {
      //
    };
  }
};
</script>
<style scoped>
.logo {
  margin: 10px auto;
  border-radius: 100px;
}
.banner {
  box-sizing: border-box;
  max-height: 300px;
}
.banner-overlay {
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 10px;
}
</style>
