<template>
  <v-container id="productsDetails">
    <v-row>
      <v-col cols="12">
        <h3>{{ $t("product_details_main") }}:</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <h4>{{ $t("digital_effect_portrait") }}</h4>
        <ul>
          <li>
            {{ $t("material") }} <br />
            <ul>
              <li>{{ $t("digital_effect_portrait_material_l1") }}</li>
              <li>
                {{ $t("digital_effect_portrait_material_l2") }}
              </li>
              <li>
                {{ $t("digital_effect_portrait_material_l3") }}
              </li>
              <li>{{ $t("digital_effect_portrait_material_l4") }}</li>
            </ul>
          </li>
          <li>
            {{ $t("delivery_time") }} <br />
            <ul>
              <li>{{ $t("digital_effect_portrait_delivery_l1") }}</li>
              <li>{{ $t("digital_effect_portrait_delivery_l2") }}</li>
            </ul>
          </li>
        </ul>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <h4>{{ $t("wood_carving") }}</h4>
        <ul>
          <li>
            {{ $t("material") }} <br />
            <ul>
              <li>{{ $t("natural_wood_material_l1") }}</li>
              <li>
                {{ $t("natural_wood_material_l2") }}
                <ul>
                  <li>{{ $t("natural_wood_material_l21") }}</li>
                  <li>{{ $t("natural_wood_material_l22") }}</li>
                  <li>{{ $t("natural_wood_material_l23") }}</li>
                </ul>
              </li>
            </ul>
          </li>
          <li>
            {{ $t("delivery_time") }} <br />
            <ul>
              <li>{{ $t("natural_wood_delivery_l1") }}</li>
              <li>{{ $t("natural_wood_delivery_l2") }}</li>
            </ul>
          </li>
        </ul>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <h4>{{ $t("other_drawing_styles") }}</h4>
        <ul>
          <li>
            {{ $t("material") }} <br />
            <ul>
              <li>{{ $t("other_drawing_styles_material_l1") }}</li>
              <li>{{ $t("other_drawing_styles_material_l2") }}</li>
            </ul>
          </li>
          <li>
            {{ $t("delivery_time") }} <br />
            <ul>
              <li>{{ $t("other_drawing_styles_delivery_l1") }}</li>
              <li>{{ $t("other_drawing_styles_delivery_l2") }}</li>
            </ul>
          </li>
        </ul>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "custom-products-details"
};
</script>

<style>
ul {
  padding-left: 5px;
  padding-right: 5px;
}
</style>
