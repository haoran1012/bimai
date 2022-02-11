import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import MainView from "@/plugin/views/Main.vue"

import home from "@/plugin/views/home/index.vue"
import {defineRoutes} from "./routers";
import routerBeforeach from "./routerBefore";

const routes: Array<RouteRecordRaw> = defineRoutes;

//创建
const router = createRouter({
    history: createWebHistory(),
    routes
});


// router.beforeEach(routerBeforeach);

export default router