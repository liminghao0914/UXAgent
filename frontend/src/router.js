import Vue from "vue";
import Router from "vue-router";

// import NotFound from "@/pages/NotFound.vue";
import MainPage from '@/pages/MainPage.vue'
import UserLogin from '@/pages/UserLogin.vue'

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "Login",
      component: UserLogin,
    },
    {
      path: "/detail/:id",
      name: "Detail",
      component: MainPage,
    },
  ]
});