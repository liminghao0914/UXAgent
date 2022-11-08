import Vue from "vue";
import Router from "vue-router";

// import NotFound from "@/pages/NotFound.vue";
import VideoDetail from '@/pages/VideoDetail.vue'
import UserLogin from '@/pages/UserLogin.vue'
import VideoList from '@/pages/VideoList.vue'
import AdminPanel from '@/pages/AdminPanel.vue'

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
      path: "/list",
      name: "List",
      component: VideoList,
    },
    {
      path: "/detail/:id",
      name: "Detail",
      component: VideoDetail,
    },
    {
      path: "/admin",
      name: "Admin",
      component: AdminPanel,
    }
  ]
});