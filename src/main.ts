import {createApp} from 'vue'
import App from './App.vue'
import Router from "@/router";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import "./registerServiceWorker";
import { initializeApp } from 'firebase/app';

export const app = createApp(App);
app.use(Toast, {
    transition: "Vue-Toastification__fade",
    maxToasts: 3,
    newestOnTop: true,
    shareAppContext: true
});

/// FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyDGQlfhJgX2oLj9kXX9zDUcOlPIB4Ltgkg",
    authDomain: "chesswebvue.firebaseapp.com",
    projectId: "chesswebvue",
    storageBucket: "chesswebvue.appspot.com",
    messagingSenderId: "705372130836",
    appId: "1:705372130836:web:c3a1ccba9e8398dfcd6101"
};

// Initialize Firebase
initializeApp(firebaseConfig);

app.use(Router).mount('#app');