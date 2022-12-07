import { createRouter, createWebHistory } from "vue-router";
import InDex from '@/pages/InDex.vue'

const routes = [
    {
        path: '/',
        component: InDex,
    },
];

export const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    history: createWebHistory(),
    routes,
});