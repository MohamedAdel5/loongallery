<template>
  <v-card v-if="dataFetched" class="main mb-16">
    <h2 class="text-center py-10 secondary--text">{{ $t("admins") }}</h2>
    <v-list class="main" v-if="admins.length > 0">
      <v-list-group dark v-for="(admin, i) in admins" :key="admin._id">
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title v-text="`${admin.name}`"></v-list-item-title>
            <div class="text-right">
              <v-btn
                :disabled="admins.length <= 1"
                class="black red--text"
                @click="
                  showDeleteAssertionWindow = true;
                  adminToDeleteIndex = i;
                "
                small
              >
                {{ $t("remove") }}
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </v-list-item-content>
        </template>
        <v-list-item>
          <v-list-item-content>
            <v-simple-table>
              <template v-slot:default>
                <tbody>
                  <tr>
                    <td>{{ $t("email") }}</td>
                    <td>
                      {{ admin.email }}
                    </td>
                  </tr>
                  <tr>
                    <td>{{ $t("authority") }}</td>
                    <td>
                      {{ admin.authority }}
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>

    <v-overlay
      z-index="11"
      opacity="0.8"
      v-if="showDeleteAssertionWindow"
      :value="true"
    >
      <div class="my-10" v-click-outside="closeDeleteAssertionWindow">
        <v-btn icon @click="closeDeleteAssertionWindow">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <template v-if="deletedSuccessfully === 'none'">
          <p>{{ $t("delete_consent") }}</p>
          <v-row>
            <v-col cols="4">
              <v-btn color="error" @click="showDeleteAssertionWindow = false">
                {{ $t("no") }}
              </v-btn>
            </v-col>
            <v-col cols="4"></v-col>
            <v-col cols="4">
              <v-btn color="success" @click="deleteAdminSubmit()">
                {{ $t("yes") }}
              </v-btn>
            </v-col>
          </v-row>
        </template>
        <v-alert type="error" v-if="deletedSuccessfully === 'fail'">{{
          $t("delete_fail")
        }}</v-alert>
        <v-alert type="success" v-if="deletedSuccessfully === 'success'">{{
          $t("delete_success")
        }}</v-alert>
      </div>
    </v-overlay>
  </v-card>
</template>

<script>
import { getAdminsMixin, deleteAdminMixin } from "@/mixins/apiMixins";
export default {
  name: "admin-delete-admins",
  mixins: [getAdminsMixin, deleteAdminMixin],
  data() {
    return {
      deletedSuccessfully: "none",
      showDeleteAssertionWindow: false,
      adminToDeleteIndex: null,
      admins: [],
      dataFetched: false
    };
  },
  methods: {
    deleteAdminSubmit: async function() {
      this.deletedSuccessfully = (await this.deleteAdmin(
        this.admins[this.adminToDeleteIndex]._id
      ))
        ? "success"
        : "fail";
      if (this.deletedSuccessfully == "success") {
        this.admins = await this.getAdmins();
      }
      this.adminToDeleteIndex = null;
    },
    closeDeleteAssertionWindow: function() {
      this.showDeleteAssertionWindow = false;
      this.deletedSuccessfully = "none";
    }
  },
  mounted: async function() {
    this.admins = await this.getAdmins();
    this.dataFetched = true;
  }
};
</script>

<style scoped>
td {
  padding: 2px;
}
</style>
