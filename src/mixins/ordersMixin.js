import {
  setAdminOrdersMixin,
  setShippingFeesMixin,
  setUserOrdersMixin,
  setNonCustomGeneralProductsMixin,
  setCustomGeneralProductsMixin
} from "./apiMixins";

export default {
  mixins: [
    setAdminOrdersMixin,
    setUserOrdersMixin,
    setShippingFeesMixin,
    setNonCustomGeneralProductsMixin,
    setCustomGeneralProductsMixin
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
      ordersListsEnable: undefined,
      orders: [],
      imageSize: process.env.VUE_APP_ORDER_IMAGE_SIZE
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
      return this.$store.getters.shippingFees[order.shippingMethod].name_en;
    },
    disableAllLists: function() {
      for (let i = 0; i < this.ordersListsEnable.length; i++) {
        this.ordersListsEnable[i] = false;
      }
    }
  }
};
