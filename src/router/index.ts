import { createRouter, createWebHashHistory } from "vue-router";
import IndexPage from '@/pages/IndexPage.vue'
import RulesPage from "@/pages/RulesPage.vue";
import HistoryPage from "@/pages/HistoryPage.vue";

const routes = [
    {
        path: '/',
        name: 'Index',
        component: IndexPage,
    },
    {
        path: '/history',
        name: 'History',
        component: HistoryPage
    },
    {
        path: '/rules',
        name: 'Rules',
        component: RulesPage
    }
];


const Router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default Router;