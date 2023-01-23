<template>
  <link rel="manifest" href="manifest.json" crossorigin="use-credentials"/>
  <link rel="shortcut icon" type="image/png" href="/public/img/icons/favicon.ico"/>
  <NetworkError v-if="update"></NetworkError>
  <nav-bar :account="account" @loginLogout="loginLogout"></nav-bar>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NavBar from "@/components/Navbar.vue";
import NetworkError from "@/components/NetworkError.vue";
import {getAuth, onAuthStateChanged} from "firebase/auth"
import {useToast} from "vue-toastification";

export default defineComponent({
  name: 'App',
  components: {
    NetworkError,
    NavBar
  },
  data() {
    return {
      account: ''
    }
  },
  methods:{
    onStart(){
      onAuthStateChanged(getAuth(), (user) => {
        if (user) {
          this.account = user.email ?? '';
        }
      });
    },
    async loginLogout() {
      const auth = getAuth();
      if (auth.currentUser) {
        await auth.signOut();
        this.account = '';
        useToast().clear();
        this.$router.push('/login');
      }
    }
  },
  beforeMount(){
    this.onStart()
  },
});
</script>