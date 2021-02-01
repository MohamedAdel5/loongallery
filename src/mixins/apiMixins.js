module.exports.setShippingFeesMixin = {
  methods: {
    setShippingFees: async function() {
      try {
        let res;
        if (Object.keys(this.$store.getters.shippingFees).length === 0) {
          res = await this.$http.get(`/global-variables/shippingFees`);
          if (res.status === 200)
            this.$store.dispatch("setShippingFees", res.data.shippingFees);
          else throw new Error("fail");
        }
      } catch (err) {
        this.$router.push(`/error`).catch(() => {});
      }
    }
  }
};

module.exports.setFacePriceMixin = {
  methods: {
    setFacePrice: async function() {
      try {
        let res;
        if (!this.$store.getters.facePrice) {
          res = await this.$http.get(`/global-variables/facePrice`);
          if (res.status === 200)
            this.$store.dispatch("setFacePrice", res.data.facePrice);
          else throw new Error("fail");
        }
      } catch (err) {
        this.$router.push(`/error`).catch(() => {});
      }
    }
  }
};

module.exports.setCustomGeneralProductsMixin = {
  methods: {
    setCustomGeneralProducts: async function() {
      try {
        let res;
        if (
          Object.keys(this.$store.getters.customGeneralProducts).length === 0
        ) {
          res = await this.$http.get(`/general-products/custom-products`);
          if (res.status === 200)
            this.$store.dispatch("setCustomGeneralProducts", res.data.products);
          else throw new Error("fail");
        }
      } catch (err) {
        this.$router.push(`/error`).catch(() => {});
      }
    }
  }
};

module.exports.setNonCustomGeneralProductsMixin = {
  methods: {
    setNonCustomGeneralProducts: async function() {
      try {
        let res;
        if (
          Object.keys(this.$store.getters.nonCustomGeneralProducts).length === 0
        ) {
          res = await this.$http.get(`/general-products/non-custom-products`);
          if (res.status === 200)
            this.$store.dispatch(
              "setNonCustomGeneralProducts",
              res.data.products
            );
          else throw new Error("fail");
        }
      } catch (err) {
        this.$router.push(`/error`).catch(() => {});
      }
    }
  }
};

module.exports.setProductsMixin = {
  methods: {
    setProducts: async function(generalProductID, pageNumber, limit) {
      try {
        const res = await this.$http.get(
          `/products?generalProduct=${generalProductID}&page=${pageNumber}&limit=${limit}`
        );
        if (res.status === 200) return res.data;
        else throw new Error("fail");
      } catch (err) {
        this.$router.push(`/error`).catch(() => {});
      }
    }
  }
};

module.exports.editGeneralProductMixin = {
  methods: {
    editGeneralProduct: async function(generalProductName, newSizesPrices) {
      try {
        const res = await this.$http.patch(
          `/general-products/${generalProductName}`,
          {
            sizesPrices: newSizesPrices
          },
          {
            headers: { Authorization: this.$store.getters.adminAuthJwt }
          }
        );
        if (res.status === 200) return true;
        else return false;
      } catch (err) {
        return false;
      }
    }
  }
};

module.exports.deleteProductMixin = {
  methods: {
    deleteProduct: async function(productToDeleteID) {
      try {
        const res = await this.$http.delete(`/products/${productToDeleteID}`, {
          headers: { Authorization: this.$store.getters.adminAuthJwt }
        });
        if (res.status === 200) {
          return true;
        } else return false;
      } catch (err) {
        return false;
      }
    }
  }
};

module.exports.editProductMixin = {
  methods: {
    editProduct: async function(formData) {
      try {
        const res = await this.$http.patch(
          `/products/${this.productID}`,
          formData,
          {
            "Content-Type": "multipart/form-data",
            headers: { Authorization: this.$store.getters.adminAuthJwt }
          }
        );
        if (res.status === 200) {
          return res.data.product;
        } else return null;
      } catch (err) {
        return null;
      }
    }
  }
};

module.exports.addProductMixin = {
  methods: {
    addProduct: async function(formData) {
      try {
        const res = await this.$http.post(`/products`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: this.$store.getters.adminAuthJwt
          }
        });
        if (res.status === 200) {
          return res.data.product;
        } else return null;
      } catch (err) {
        return null;
      }
    }
  }
};

module.exports.setUserOrdersMixin = {
  methods: {
    setUserOrders: async function(pageNumber, elementsPerPage) {
      try {
        let res = await this.$http.get(
          `/users/me/orders?sort=-date&page=${pageNumber}&limit=${elementsPerPage}`,
          {
            headers: { Authorization: this.$store.getters.authJwt }
          }
        );
        if (res.status === 200) return res.data;
        else throw new Error("fail");
      } catch (err) {
        this.$router.push(`/error`).catch(() => {});
      }
    }
  }
};

module.exports.setAdminOrdersMixin = {
  methods: {
    setAdminOrders: async function(pageNumber, elementsPerPage) {
      try {
        let res = await this.$http.get(
          `/orders?sort=-date&page=${pageNumber}&limit=${elementsPerPage}`,
          {
            headers: { Authorization: this.$store.getters.adminAuthJwt }
          }
        );
        if (res.status === 200) return res.data;
        else throw new Error("fail");
      } catch (err) {
        this.$router.push(`/error`).catch(() => {});
      }
    }
  }
};

module.exports.makeOrderMixin = {
  methods: {
    makeOrder: async function(formData, options) {
      try {
        const res = await this.$http.post(`/orders`, formData, options);
        if (res.status === 200) {
          return true;
        } else {
          throw new Error("fail");
        }
      } catch (err) {
        return false;
      }
    }
  }
};

module.exports.setMetroStationsMixin = {
  methods: {
    setMetroStations: async function() {
      try {
        let res = await this.$http.get(`/global-variables/metroStations`);
        if (res.status === 200) return res.data;
        else throw new Error("fail");
      } catch (err) {
        this.$router.push(`/error`).catch(() => {});
      }
    }
  }
};

// module.exports.setOurLocationsMixin = {
//   methods: {
//     setOurLocations: async function() {
//       try {
//         let ourLocationsShort, ourLocationsLong;
//         let res = await this.$http.get(`/global-variables/ourLocations`);
//         if (res.status === 200) {
//           ourLocationsShort = res.data.ourLocations.map(
//             location => location.short
//           );
//           ourLocationsLong = res.data.ourLocations.map(
//             location => location.long
//           );
//           return { ourLocationsShort, ourLocationsLong };
//         } else throw new Error("fail");
//       } catch (err) {
//         this.$router.push(`/error`).catch(() => {});
//       }
//     }
//   }
// };

module.exports.setOneProductMixin = {
  methods: {
    setOneProduct: async function(id) {
      try {
        let res = await this.$http.get(`/products/${id}`);
        if (res.status === 200) {
          return res.data.product;
        } else throw new Error("fail");
      } catch (err) {
        this.$router.push(`/error`).catch(() => {});
      }
    }
  }
};

module.exports.setPreviewSizesMixin = {
  methods: {
    setPreviewSizes: async function() {
      try {
        const res = await this.$http.get("/global-variables/sizesPreview");
        if (res.status === 200) return res.data.sizesPreview;
        else throw new Error("fail");
      } catch (err) {
        this.$router.push("/error");
      }
    }
  }
};

module.exports.setDrawingStylesExamplesMixin = {
  methods: {
    setDrawingStylesExamples: async function() {
      try {
        const res = await this.$http.get(
          "/global-variables/drawingStylesExamples"
        );
        if (res.status === 200) return res.data.drawingStylesExamples;
        else throw new Error("fail");
      } catch (err) {
        this.$router.push("/error");
      }
    }
  }
};

module.exports.loginMixin = {
  methods: {
    login: async function(email, password) {
      try {
        const res = await this.$http.post("/authentication/login", {
          email,
          password
        });

        if (res.status === 200) {
          localStorage.setItem("auth_jwt", res.data.token);
          this.$store.dispatch("setUser", res.data.user);
          this.$store.dispatch("setAuthJwt", res.data.token);
          this.$store.dispatch("setLoggedInStatus", true);
          this.$router.push(`/home`).catch(() => {});
          return true;
        } else {
          return false;
        }
      } catch (err) {
        return false;
      }
    }
  }
};

module.exports.signupMixin = {
  methods: {
    signup: async function(newUserObject) {
      try {
        const res = await this.$http.post(
          "/authentication/signup",
          newUserObject
        );

        if (res.status === 200) {
          localStorage.setItem("auth_jwt", res.data.token);
          this.$store.dispatch("setUser", res.data.user);
          this.$store.dispatch("setAuthJwt", res.data.token);
          this.$store.dispatch("setLoggedInStatus", true);
          this.$router.push(`/home`).catch(() => {});
          return true;
        } else {
          return false;
        }
      } catch (err) {
        return false;
      }
    }
  }
};

module.exports.adminLoginMixin = {
  methods: {
    adminLogin: async function(email, password) {
      try {
        const res = await this.$http.post("/authentication/admin-login", {
          email,
          password
        });

        if (res.status === 200) {
          //To make the admin have a longer session (not secure)
          //localStorage.setItem("admin_auth_jwt", res.data.token);
          //But then you will need to search any word called sessionStorage called for the admin_auth and change it to localStorage
          sessionStorage.setItem("admin_auth_jwt", res.data.token);
          this.$store.dispatch("setAdmin", res.data.user);
          this.$store.dispatch("setAdminAuthJwt", res.data.token);
          this.$store.dispatch("setAdminLoggedInStatus", true);
          this.$router.push(`/6324789123/admin`).catch(() => {});
          return true;
        } else {
          return false;
        }
      } catch (err) {
        return false;
      }
    }
  }
};

module.exports.setSeenMixin = {
  methods: {
    setSeen: async function(orderID) {
      //Send a request to alter the seen status
      try {
        const res = await this.$http.patch(
          `/orders/${orderID}/seen`,
          {},
          {
            headers: { Authorization: this.$store.getters.adminAuthJwt }
          }
        );
        if (res.status === 200) {
          return true;
        } else return false;
      } catch (err) {
        return true;
      }
    }
  }
};

module.exports.setDeliveredMixin = {
  methods: {
    setDelivered: async function(orderID) {
      //Send a request to alter the delivered status
      //Check if the request went well then set the delivered status here
      try {
        const res = await this.$http.patch(
          `/orders/${orderID}/delivered`,
          {},
          {
            headers: { Authorization: this.$store.getters.adminAuthJwt }
          }
        );
        if (res.status === 200) {
          return true;
        } else return false;
      } catch (err) {
        return false;
      }
    }
  }
};

module.exports.deleteOrderMixin = {
  methods: {
    deleteOrder: async function(orderID) {
      try {
        const res = await this.$http.delete(`/orders/${orderID}`, {
          headers: { Authorization: this.$store.getters.adminAuthJwt }
        });
        if (res.status === 200) {
          return true;
        } else return false;
      } catch (err) {
        return false;
      }
    }
  }
};

module.exports.setUserMixin = {
  methods: {
    setUser: async function(token) {
      try {
        const res = await this.$http.get(`/users/me`, {
          headers: { Authorization: token }
        });
        if (res.status === 200) {
          this.$store.dispatch("setUser", res.data.user);
          this.$store.dispatch("setAuthJwt", token);
          this.$store.dispatch("setLoggedInStatus", true);
          return true;
        } else return false;
      } catch (err) {
        return false;
      }
    }
  }
};

module.exports.changeAddressMixin = {
  methods: {
    changeAddress: async function(addresses) {
      try {
        const res = await this.$http.patch(
          `/users/me/change-addresses`,
          {
            addresses
          },
          {
            headers: { Authorization: this.$store.getters.authJwt }
          }
        );
        if (res.status === 200) {
          this.$store.dispatch("editUser", {
            addresses
          });
          return true;
        } else return false;
      } catch (err) {
        return false;
      }
    }
  }
};

module.exports.changePhoneNumbersMixin = {
  methods: {
    changePhoneNumbers: async function(phoneNumbers) {
      try {
        const res = await this.$http.patch(
          `/users/me/change-phone-numbers`,
          {
            phoneNumbers: Array.from(phoneNumbers)
          },
          {
            headers: { Authorization: this.$store.getters.authJwt }
          }
        );
        if (res.status === 200) {
          this.$store.dispatch("editUser", {
            phoneNumbers: Array.from(phoneNumbers)
          });
          return true;
        } else return false;
      } catch (err) {
        return false;
      }
    }
  }
};

module.exports.setAnnouncementMixin = {
  methods: {
    setAnnouncement: async function() {
      try {
        const res = await this.$http.get("/offers");
        if (res.status !== 200 || !res.data.announcement) return;
        const announcementImage = res.data.announcement.image;
        if (!announcementImage) throw Error("fail");
        return announcementImage;
      } catch (err) {
        return null;
      }
    }
  }
};

module.exports.editAnnouncementMixin = {
  methods: {
    editAnnouncement: async function(formData) {
      try {
        const res = await this.$http.post(`/offers`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: this.$store.getters.adminAuthJwt
          }
        });
        if (res.status === 200) {
          return true;
        } else return false;
      } catch (err) {
        return false;
      }
    }
  }
};

module.exports.deleteAnnouncementMixin = {
  methods: {
    deleteAnnouncement: async function() {
      try {
        const res = await this.$http.delete(`/offers`, {
          headers: {
            Authorization: this.$store.getters.adminAuthJwt
          }
        });
        if (res.status === 200) {
          return true;
        } else return false;
      } catch (err) {
        return false;
      }
    }
  }
};

module.exports.editGlobalVariableMixin = {
  methods: {
    editGlobalVariable: async function(
      globalVariableName,
      updatedGlobalVariableObject
    ) {
      try {
        const res = await this.$http.patch(
          `/global-variables/${globalVariableName}`,
          {
            updatedGlobalVariableObject
          },
          {
            headers: { Authorization: this.$store.getters.adminAuthJwt }
          }
        );
        if (res.status === 200) return true;
        else return false;
      } catch (err) {
        return false;
      }
    }
  }
};

module.exports.backupMixin = {
  methods: {
    backup: async function() {
      try {
        const res = await this.$http({
          method: "get",
          url: "/database-backup",
          responseType: "arraybuffer",
          headers: { Authorization: this.$store.getters.adminAuthJwt }
        });
        return res;
      } catch (err) {
        return null;
      }
    }
  }
};

module.exports.emailBroadcastMixin = {
  methods: {
    emailBroadcast: async function(body) {
      try {
        const res = await this.$http.post(`/emails/broadcast`, body, {
          headers: {
            Authorization: this.$store.getters.adminAuthJwt
          }
        });
        if (res.status === 200) {
          return true;
        } else return false;
      } catch (err) {
        return false;
      }
    }
  }
};
