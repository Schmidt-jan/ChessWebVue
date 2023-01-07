<template>
  <link rel="manifest" href="manifest.json" crossorigin="use-credentials"/>
  <link rel="shortcut icon" type="image/png" href="/public/img/icons/favicon.ico"/>
  <NetworkError v-if="update"></NetworkError>
  <nav-bar></nav-bar>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NavBar from "@/components/Navbar.vue";
import NetworkError from "@/components/NetworkError.vue";


export default defineComponent({
  name: 'App',
  components: {
    NetworkError,
    NavBar
  },
  created() {
    window.addEventListener('beforeunload', (event) => {
      console.log(`Refresh page`);
      this.$forceUpdate;
    })
  }
});
</script>