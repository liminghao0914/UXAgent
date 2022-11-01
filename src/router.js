import { createWebHistory, createRouter } from "vue-router";

import NotFound from "@/pages/NotFound.vue";
import MainPage from '@/pages/MainPage.vue'

const routes = [
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;