<template>
  <nav-bar></nav-bar>
 <in-dex :ws="ws"></in-dex>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import InDex from "@/pages/InDex.vue";
import NavBar from "@/components/Navbar.vue";

export default defineComponent({
  name: 'App',
  components: {
    NavBar,
    InDex
  },
  data() {
    return {
      ws: new WebSocket('ws://localhost:9000/ws')
    }
  }
});
</script>