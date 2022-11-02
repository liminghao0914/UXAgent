import Vue from "vue";
import Router from "vue-router";

import NotFound from "@/pages/NotFound.vue";
import MainPage from '@/pages/MainPage.vue'

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "Home",
      component: MainPage,
    },
    {
      path: "/about",
      name: "About",
      component: NotFound,
    },
  ]
});