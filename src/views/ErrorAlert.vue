<template>
  <div id="not_found">
    <v-card
      class="d-flex flex-column justify-center mt-10"
      color="rgba(0,0,0,0)"
    >
      <v-row class="d-flex justify-center">
        <v-card-title class="secondary--text"
          >We are sorry, there is a fatal error. Please try again.</v-card-title
        >
      </v-row>
      <v-card-actions>
        <v-container>
          <v-row class="d-flex justify-center">
            <v-card
              flat
              tile
              width="100%"
              color="rgba(0,0,0,0)"
              class="secondary--text text-center"
            >
              <v-card-text>
                <b class="white--text"
                  >Still facing the same issue? Contact Us</b
                >
                <br />
                <v-divider></v-divider>
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
            </v-card>
          </v-row>
          <v-row class="mt-10 d-flex justify-center">
            <router-link to="/" class="secondary--text"
              >Back to home</router-link
            >
          </v-row>
        </v-container>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "error",
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
