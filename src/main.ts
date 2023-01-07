import {createApp} from 'vue'
import App from './App.vue'
import Router from "@/router";


import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import "./registerServiceWorker";

export const app = createApp(App);
app.config.globalProperties.inetAvailable = false;
app.use(Toast, {
    transition: "Vue-Toastification__fade",
    maxToasts: 3,
    newestOnTop: true,
    shareAppContext: true
});
app.use(Router).mount('#app');