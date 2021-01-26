const parseJWTMixin = {
  methods: {
    parseJwt: function(token) {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function(c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      return JSON.parse(jsonPayload);
    }
  }
};
module.exports.parseJWTMixin = parseJWTMixin;

module.exports.validateAdminTokenMixin = {
  mixins: [parseJWTMixin],
  methods: {
    validateAdminToken: function(token) {
      if (token) {
        const jwtObject = this.parseJwt(token);
        if (!jwtObject.admin) return "invalid";
        if (Date.now() >= jwtObject.exp * 1000) {
          return "expired";
        } else {
          return "valid";
        }
      } else {
        return "invalid";
      }
    }
  }
};

module.exports.validateTokenMixin = {
  mixins: [parseJWTMixin],
  methods: {
    validateToken: function(token) {
      if (token) {
        const jwtObject = this.parseJwt(token);
        if (Date.now() >= jwtObject.exp * 1000) {
          return "expired";
        } else {
          return "valid";
        }
      } else {
        return "invalid";
      }
    }
  }
};
