<template>
  <v-container id="productsDetails">
    <v-row>
      <v-col cols="12">
        <h3>{{ $t("product_details_main") }}</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <h4>{{ $t("decoration_tableaus") }}</h4>
        <ul>
          <li>
            {{ $t("material") }}: <br />
            <ul>
              <li>{{ $t("decoration_tableaus_material_l1") }}</li>
              <li>
                {{ $t("decoration_tableaus_material_l2") }}
              </li>
              <li>
                {{ $t("decoration_tableaus_material_l3") }}
              </li>
              <li>{{ $t("decoration_tableaus_material_l4") }}</li>
            </ul>
          </li>
          <li>
            {{ $t("delivery_time") }}: <br />
            <ul>
              <li>{{ $t("decoration_tableaus_delivery_l1") }}</li>
              <li>
                {{ $t("decoration_tableaus_delivery_l2") }}
              </li>
            </ul>
          </li>
        </ul>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <h4>{{ $t("mersal") }}</h4>
        <ul>
          <li>
            {{ $t("material") }} <br />
            <ul>
              <li>{{ $t("mersal_material_l1") }}</li>
              <li>{{ $t("mersal_material_l2") }}</li>
            </ul>
          </li>
          <li>
            {{ $t("delivery_time") }}<br />
            <ul>
              <li>{{ $t("mersal_delivery_l1") }}</li>
              <li>{{ $t("mersal_delivery_l2") }}</li>
            </ul>
          </li>
        </ul>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "non-custom-products-details",
  data() {
    return {};
  }
};
</script>

<style>
ul {
  padding-left: 5px;
  padding-right: 5px;
}
</style>
