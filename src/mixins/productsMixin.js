import {
  setNonCustomGeneralProductsMixin,
  setProductsMixin
} from "./apiMixins";

export default {
  mixins: [setNonCustomGeneralProductsMixin, setProductsMixin],
  data() {
    return {
      dataFetched: false,
      productsCount: 0,
      elementsPerRow: Number(process.env.VUE_APP_PRODUCTS_ELEMENTS_PER_ROW),
      elementsPerPage: Number(process.env.VUE_APP_PRODUCTS_ELEMENTS_PER_PAGE),
      page: 1,
      pagesCount: 1,
      tabIndex: 0,
      tabs: [],
      showAddNewProductWindow: false,
      showEditProductWindow: false,
      showDeleteAssertionWindow: false,
      // sortByOptions: [
      //   {
      //     text: "Recently Added",
      //     value: "recent",
      //   },
      //   {
      //     text: "Price: Low To High",
      //     value: "price",
      //   },
      //   {
      //     text: "Price: High To Low",
      //     value: "-price",
      //   },
      // ],
      generalProductPrices: [],
      products: []
    };
  },
  computed: {
    currentCategory() {
      return this.tabs[this.tabIndex].category;
    },
    nonCustomGeneralProducts() {
      return this.$store.getters.nonCustomGeneralProducts;
    }
  },

  methods: {
    getProducts: async function(category, pageNumber) {
      await this.setNonCustomGeneralProducts();
      // If the call is from the mounted hook, then use the first nonCustomGeneralProduct as the category
      if (category.length === 0) {
        category = Object.keys(this.nonCustomGeneralProducts)[0];
      }

      const data = await this.setProducts(
        this.nonCustomGeneralProducts[category].id,
        pageNumber,
        this.elementsPerPage
      );
      this.pagesCount = Math.ceil(data.totalSize / this.elementsPerPage);
      this.productsCount = data.size;
      this.products = data.products;
      const generalProductPrices = Object.values(
        this.nonCustomGeneralProducts[category].sizesPrices
      );
      this.generalProductPrices = generalProductPrices;
      this.page = pageNumber;
    }
  },
  mounted: async function() {
    await this.getProducts("", this.page);

    this.tabs = [];
    for (let key of Object.keys(this.nonCustomGeneralProducts)) {
      this.tabs.push({
        title: key,
        category: key
      });
    }

    this.dataFetched = true;
  }
};
