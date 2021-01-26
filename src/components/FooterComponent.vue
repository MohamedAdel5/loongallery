<template>
  <v-footer padless color="primary white--text" style="z-index: 10">
    <v-card width="100%" class="primary white--text text-center">
      <v-card-text>
        <b class="white--text">Contact Us </b> <br />
        <a
          v-for="item in items"
          :key="item.link"
          target="_blank"
          :href="item.link"
        >
          <v-btn class="mx-4 white--text" icon>
            <v-icon size="24px">
              {{ item.icon }}
            </v-icon>
          </v-btn>
        </a>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-text class="white--text pt-0">
        {{ new Date().getFullYear() }} — All copyrights reserved for
        <strong>Loon Gallery &copy;</strong>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  name: "footer-component",
  data() {
    return {
      items: [
        {
          icon: "mdi-facebook",
          link: "https://www.facebook.com/Loon.Gallery/"
        },
        {
          icon: "mdi-instagram",
          link: "https://www.instagram.com/loon.gallery/"
        },
        { icon: "mdi-whatsapp", link: "https://wa.me/201120008127" },
        {
          icon: "mdi-gmail",
          link: "mailto:loongallery5@gmail.com"
        }
      ]
    };
  }
};
</script>

<style scoped></style>
