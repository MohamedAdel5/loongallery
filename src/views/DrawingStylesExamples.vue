<template>
  <v-container v-if="dataFetched">
    <v-card tile flat class="main mb-16">
      <v-card-title
        class="examples-card-title d-block text-center secondary--text"
        >Drawing Styles Examples</v-card-title
      >
      <v-container>
        <template v-for="(style, i) in drawingStylesExamples">
          <v-row :key="i" class="pb-4">
            <v-col cols="12">
              <h2 class="secondary--text">{{ style.style }}</h2>
              <v-container
                class="d-flex flex-row justify-start align-center flex-wrap pa-0 pt-4"
              >
                <div
                  v-for="(image, i) in style.images"
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
          <v-divider :key="i + drawingStylesExamples.length"></v-divider>
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
export default {
  name: "drawing-styles-examples",
  data() {
    return {
      imageSize: "200px",
      dataFetched: false,

      drawingStylesExamples: null
    };
  },
  methods: {
    getDrawingStylesExamples: async function() {
      try {
        const res = await this.$http.get(
          "/global-variables/drawingStylesExamples"
        );
        if (res.status === 200)
          this.drawingStylesExamples = res.data.drawingStylesExamples;
        else throw new Error("fail");
      } catch (err) {
        this.$router.push("/error");
      }
    },
    goBack: function() {
      this.$router.go(-1);
    }
  },
  mounted: async function() {
    await this.getDrawingStylesExamples();

    this.dataFetched = true;
  }
};
</script>

<style scoped>
.examples-card-title {
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
.main {
  background-image: url("~@/assets/sketch-texture.jpg") !important;
  background-repeat: repeat;
  background-size: 400px 400px;
  background-color: black !important;
  border-radius: 10px !important;
}
.v-image {
  border: solid 1px !important;
  border-radius: 5px;
}
</style>
