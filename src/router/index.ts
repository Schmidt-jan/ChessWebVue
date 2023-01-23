import { createRouter, createWebHistory } from "vue-router";
import IndexPage from '@/pages/IndexPage.vue'
import RulesPage from "@/pages/RulesPage.vue";
import HistoryPage from "@/pages/HistoryPage.vue";
import AuthRegister from "@/components/AuthRegister.vue";
import AuthLogin from "@/components/AuthLogin.vue";

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
    },
    {
        path: '/register',
        name: 'Register',
        component: AuthRegister
    },
    {
        path: '/login',
        name: 'Login',
        component: AuthLogin
    }
];


const Router = createRouter({
    history: createWebHistory(),
    routes
});

export default Router;