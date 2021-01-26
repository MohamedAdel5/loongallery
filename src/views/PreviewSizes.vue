<template>
  <v-container v-if="dataFetched">
    <v-card tile flat class="main mb-16">
      <v-card-title class="sizes-card-title d-block text-center secondary--text"
        >Sizes Preview</v-card-title
      >
      <v-container>
        <template v-for="(size, i) in sizesPreview">
          <v-row class="pb-4" :key="i">
            <v-col cols="12">
              <h2 class="secondary--text">{{ size.size }}</h2>
              <v-container
                class="d-flex flex-row justify-start align-center flex-wrap pa-0 pt-4"
              >
                <div
                  v-for="(image, i) in size.images"
                  :key="i"
                  class="pr-2 py-2"
                >
                  <v-img
                    :src="image"
                    :height="imageSize"
                    :width="imageSize"
                  ></v-img>
                </div>
              </v-container>
            </v-col>
          </v-row>
          <v-divider :key="i + sizesPreview.length"></v-divider>
        </template>
        <v-row>
          <v-col cols="12" class="d-flex justify-end pt-16 pb-0">
            <v-btn @click="goBack" max-width="200px" color="secondary"
              >Go Back</v-btn
            >
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import { setPreviewSizesMixin } from "@/mixins/apiMixins";

export default {
  name: "preview-sizes",
  mixins: [setPreviewSizesMixin],
  data() {
    return {
      imageSize: `${process.env.VUE_APP_PREVIEW_IMAGE_SIZE}px`,
      dataFetched: false,
      sizesPreview: null
    };
  },
  methods: {
    goBack: function() {
      this.$router.go(-1);
    }
  },
  mounted: async function() {
    this.sizesPreview = await this.setPreviewSizes();
    this.dataFetched = true;
  }
};
</script>

<style scoped>
.sizes-card-title {
  font-family: "Advent Pro";
  font-size: 30px;
  font-weight: bolder;
  white-space: pre-wrap;
  word-break: normal;
}

h2 {
  font-size: 20px;
  font-weight: normal;
}
.v-image {
  border: solid 1px !important;
  border-radius: 5px;
}
</style>
