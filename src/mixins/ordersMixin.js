import {
  setAdminOrdersMixin,
  setShippingFeesMixin,
  setUserOrdersMixin,
  setNonCustomGeneralProductsMixin,
  setCustomGeneralProductsMixin,
  searchOrderMixin
} from "./apiMixins";

export default {
  mixins: [
    setAdminOrdersMixin,
    setUserOrdersMixin,
    setShippingFeesMixin,
    setNonCustomGeneralProductsMixin,
    setCustomGeneralProductsMixin,
    searchOrderMixin
  ],
  data() {
    return {
      dataFetched: false,
      page: 1,
      elementsPerPage: process.env.VUE_APP_ORDERS_ELEMENTS_PER_PAGE,
      pagesCount: null,
      totalCount: null,
      ordersCount: null,
      unseenCount: null,
      undeliveredCount: null,
      rejectedCount: null,
      inTransitCount: null,

      ordersListsEnable: undefined,
      orders: [],
      imageSize: process.env.VUE_APP_ORDER_IMAGE_SIZE,
      searchOrderCode: ""
    };
  },
  mounted: async function() {
    try {
      await this.getOrders(this.page);
      this.ordersListsEnable = new Array(this.orders.length);
      this.disableAllLists();
      await this.setNonCustomGeneralProducts();
      await this.setCustomGeneralProducts();
      await this.setShippingFees();

      //For designer admin only
      if (
        this.orders &&
        this.orders.length > 0 &&
        this.$store.getters.admin &&
        this.$store.getters.admin.authority === "designer"
      ) {
        this.orders = this.orders.filter(o => {
          for (let p of o.products) {
            if (p.generalProduct.productName === "Digital effect") return true;
          }
          return false;
        });
      }

      this.dataFetched = true;
    } catch (err) {
      this.$router.push(`/error`).catch(() => {});
    }
  },
  methods: {
    getOrders: async function(pageNumber) {
      let data;
      if (this.$options.name === "user-orders")
        //if component name is user-orders
        data = await this.setUserOrders(pageNumber, this.elementsPerPage);
      // if this.$options.name == "admin-orders"
      else data = await this.setAdminOrders(pageNumber, this.elementsPerPage);

      this.pagesCount = Math.ceil(data.totalSize / this.elementsPerPage);
      this.totalCount = data.totalSize;
      this.ordersCount = data.size;
      this.unseenCount = data.totalUnseen;
      this.rejectedCount = data.totalRejected;
      this.inTransitCount = data.totalInTransit;
      this.undeliveredCount = data.totalUndelivered;

      this.orders = data.orders;
      this.page = pageNumber;
    },
    totalPrice(index) {
      let totalPrice = 0;
      this.orders[index].products.forEach(product => {
        totalPrice += product.price;
      });
      return totalPrice + this.orders[index].shippingFees;
    },
    hasACustomOrder: function(order) {
      let customGeneralProducts = this.$store.getters.customGeneralProducts;
      let keys = Object.keys(customGeneralProducts);
      for (let i = 0; i < order.products.length; i++) {
        const productName = order.products[i].generalProduct.productName;
        if (keys.includes(productName)) return true;
      }
      return false;
    },
    isCustomProduct: function(product) {
      let customGeneralProducts = this.$store.getters.customGeneralProducts;
      let keys = Object.keys(customGeneralProducts);

      const productName = product.generalProduct.productName;
      if (keys.includes(productName)) return true;
      else return false;
    },
    orderShippingMethod: function(order) {
      if (this.$root.$i18n.locale === "en")
        return this.$store.getters.shippingFees[order.shippingMethod].name_en;
      else
        return this.$store.getters.shippingFees[order.shippingMethod].name_ar;
    },
    getProductCategoryName: function(product) {
      if (this.$root.$i18n.locale === "en")
        return product.generalProduct.productName;
      else return product.generalProduct.productName_Ar;
    },
    disableAllLists: function() {
      for (let i = 0; i < this.ordersListsEnable.length; i++) {
        this.ordersListsEnable[i] = false;
      }
    },
    searchOrderSubmit: async function() {
      if (this.searchOrderCode && this.searchOrderCode.length > 0) {
        const data = await this.searchOrder(this.searchOrderCode);
        this.orders = data.orders;
        this.pagesCount = 1;
        this.page = 1;
      } else {
        await this.getOrders(1);
      }
    }
  }
};
