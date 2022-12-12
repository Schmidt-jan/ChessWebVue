<template>
  <nav-bar></nav-bar>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NavBar from "@/components/Navbar.vue";


export default defineComponent({
  name: 'App',
  components: {
    NavBar
  },
});
</script>