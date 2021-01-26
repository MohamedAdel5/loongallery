import Vue from "vue";
import Router from "vue-router";
import Home from "../views/Home.vue";
import ShowProduct from "../views/ShowProduct.vue";
import Login from "../views/Login.vue";
import Signup from "../views/Signup.vue";
import Admin from "../views/Admin.vue";
import AdminLogin from "../views/AdminLogin.vue";
import MyProfile from "../views/MyProfile.vue";
import ErrorAlert from "../views/ErrorAlert.vue";

import NotFound from "../views/NotFound.vue";
import PreviewSizes from "../views/PreviewSizes.vue";
import DrawingStylesExamples from "../views/DrawingStylesExamples.vue";
import ShoppingCart from "../views/ShoppingCart.vue";

Vue.use(Router);

const routes = [
  {
    path: "/home/:component",
    name: "home",
    component: Home
  },
  {
    path: "/",
    redirect: "/home/our-products"
    // name: "home",
    // component: Home,
  },
  {
    path: "/home",
    redirect: "/home/our-products"
  },
  {
    path: "/product/:id",
    name: "show-product",
    component: ShowProduct
  },
  {
    path: "/preview-sizes",
    name: "preview-sizes",
    component: PreviewSizes
  },
  {
    path: "/shopping-cart",
    name: "shopping-cart",
    component: ShoppingCart
  },
  {
    path: "/drawing-styles-examples",
    name: "drawing-styles-examples",
    component: DrawingStylesExamples
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/signup",
    name: "signup",
    component: Signup
  },
  {
    path: "/6324789123/admin",
    name: "admin",
    component: Admin
  },
  {
    path: "/6324789123/admin/login",
    name: "admin-login",
    component: AdminLogin
  },
  {
    path: "/my-profile",
    name: "my-profile",
    component: MyProfile
  },
  {
    path: "/error",
    name: "error",
    component: ErrorAlert
  },
  {
    path: "/404",
    name: "not-found",
    component: NotFound
  },
  {
    path: "*",
    redirect: "/404"
  }
];

const scrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) {
    return savedPosition;
  }

  if (to.hash) {
    return { selector: to.hash };
  }

  return { x: 0, y: 0 };
};

const router = new Router({
  mode: "history",
  routes,
  scrollBehavior
});

export default router;
