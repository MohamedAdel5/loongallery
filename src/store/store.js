import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  strict: true, //Forces mutations to be handled inside this object and throws an error if any mutations occured outside it.
  state: {
    nonCustomGeneralProducts: {},
    customGeneralProducts: {},
    cart: [],
    facePrice: null,
    giftBowPrice: null,
    giftWrapPrice: null,
    shippingFees: {},
    loggedIn: true,
    authJwt: null,
    user: null,
    adminLoggedIn: false,
    adminAuthJwt: null,
    admin: null
  },
  getters: {
    nonCustomGeneralProducts: state => {
      return state.nonCustomGeneralProducts;
    },
    customGeneralProducts: state => {
      return state.customGeneralProducts;
    },
    categories: state => {
      return Object.keys(state.nonCustomGeneralProducts);
    },
    customDrawingStyles: state => {
      return Object.keys(state.customGeneralProducts);
    },
    cart: state => {
      return state.cart;
    },
    facePrice: state => {
      return state.facePrice;
    },
    giftBowPrice: state => {
      return state.giftBowPrice;
    },
    giftWrapPrice: state => {
      return state.giftWrapPrice;
    },

    shippingFees: state => {
      return state.shippingFees;
    },
    loggedIn: state => {
      return state.loggedIn;
    },
    user: state => {
      return state.user;
    },
    authJwt: state => {
      return state.authJwt;
    },
    adminLoggedIn: state => {
      return state.adminLoggedIn;
    },
    admin: state => {
      return state.admin;
    },
    adminAuthJwt: state => {
      return state.adminAuthJwt;
    }
  },
  mutations: {
    SET_NON_CUSTOM_GENERAL_PRODUCTS: (state, generalProducts) => {
      state.nonCustomGeneralProducts = {};
      for (let val of generalProducts) {
        state.nonCustomGeneralProducts[val.productName] = {
          id: val._id,
          productName_Ar: val.productName_Ar,
          sizesPrices: val.sizesPrices
        };
      }
    },
    SET_CUSTOM_GENERAL_PRODUCTS: (state, generalProducts) => {
      state.customGeneralProducts = {};
      for (let val of generalProducts) {
        state.customGeneralProducts[val.productName] = {
          id: val._id,
          productName_Ar: val.productName_Ar,
          sizesPrices: val.sizesPrices
        };
      }
    },
    ADD_TO_CART: (state, product) => {
      let productIndex = -1;
      if (product.productID) {
        productIndex = state.cart.findIndex(p => {
          return p.productID === product.productID && p.size === product.size;
        });
      }
      //IF product is custom product or is not a duplicate, insert it directly.
      if (productIndex < 0) {
        state.cart.push(product);
      } //If the product is a duplicate, just add its quantity and price to its duplicates' quantity and price in the array
      else {
        state.cart[productIndex].quantity += product.quantity;
        state.cart[productIndex].price += product.price;
      }
    },
    REMOVE_FROM_CART: (state, index) => {
      state.cart.splice(index, 1);
    },
    EMPTY_CART: state => {
      state.cart = [];
    },
    SET_FACE_PRICE: (state, facePrice) => {
      state.facePrice = facePrice;
    },
    SET_GIFT_BOW_PRICE: (state, giftBowPrice) => {
      state.giftBowPrice = giftBowPrice;
    },
    SET_GIFT_WRAP_PRICE: (state, giftWrapPrice) => {
      state.giftWrapPrice = giftWrapPrice;
    },

    SET_SHIPPING_FEES: (state, shippingFees) => {
      state.shippingFees = shippingFees;
    },

    SET_LOGGED_IN_STATUS: (state, loggedIn) => {
      state.loggedIn = loggedIn;
    },
    SET_AUTH_JWT: (state, authJwt) => {
      state.authJwt = authJwt;
    },
    SET_USER: (state, user) => {
      state.user = user;
    },
    EDIT_USER: (state, props) => {
      const keys = Object.keys(props);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        state.user[key] = props[key];
      }
    },

    SET_ADMIN_LOGGED_IN_STATUS: (state, adminLoggedIn) => {
      state.adminLoggedIn = adminLoggedIn;
    },
    SET_ADMIN_AUTH_JWT: (state, adminAuthJwt) => {
      state.adminAuthJwt = adminAuthJwt;
    },
    SET_ADMIN: (state, admin) => {
      state.admin = admin;
    }
  },

  actions: {
    setNonCustomGeneralProducts: ({ commit }, generalProducts) => {
      commit("SET_NON_CUSTOM_GENERAL_PRODUCTS", generalProducts);
    },
    setCustomGeneralProducts: ({ commit }, generalProducts) => {
      commit("SET_CUSTOM_GENERAL_PRODUCTS", generalProducts);
    },
    addToCart: ({ commit }, product) => {
      commit("ADD_TO_CART", product);
    },
    removeFromCart: ({ commit }, index) => {
      commit("REMOVE_FROM_CART", index);
    },
    emptyCart: ({ commit }) => {
      commit("EMPTY_CART");
    },
    setFacePrice: ({ commit }, facePrice) => {
      commit("SET_FACE_PRICE", facePrice);
    },
    setGiftBowPrice: ({ commit }, giftBowPrice) => {
      commit("SET_GIFT_BOW_PRICE", giftBowPrice);
    },
    setGiftWrapPrice: ({ commit }, giftWrapPrice) => {
      commit("SET_GIFT_WRAP_PRICE", giftWrapPrice);
    },
    setShippingFees: ({ commit }, shippingFees) => {
      commit("SET_SHIPPING_FEES", shippingFees);
    },
    setLoggedInStatus: ({ commit }, loggedIn) => {
      commit("SET_LOGGED_IN_STATUS", loggedIn);
    },
    setAuthJwt: ({ commit }, authJwt) => {
      commit("SET_AUTH_JWT", authJwt);
    },
    setUser: ({ commit }, user) => {
      commit("SET_USER", user);
    },
    editUser: ({ commit }, props) => {
      commit("EDIT_USER", props);
    },
    setAdminLoggedInStatus: ({ commit }, adminLoggedIn) => {
      commit("SET_ADMIN_LOGGED_IN_STATUS", adminLoggedIn);
    },
    setAdminAuthJwt: ({ commit }, adminAuthJwt) => {
      commit("SET_ADMIN_AUTH_JWT", adminAuthJwt);
    },
    setAdmin: ({ commit }, admin) => {
      commit("SET_ADMIN", admin);
    }
  }
});

export default store;
