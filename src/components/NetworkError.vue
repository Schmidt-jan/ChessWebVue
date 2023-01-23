<template>
  <div id="popupNetworkError" class="d-flex justify-content-center align-items-center">
    <div id="popupError">
      <div class="chooser">
        <h1>No internet connection</h1>
      </div >
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: 'NetworkError',
});
</script>

<style>
.chooser > button {
  margin: 20px;
}

.chooser > button > .icon {
  font-size: 100px;
}

#popupNetworkError {
  background: rgb(0, 0, 0, 0.5);
  z-index: 100;
  position: absolute;
  width: 100%;
  height: 100%;
}

#popupError {
  background: rgba(255, 0, 0, 0.76);
  border-radius: 10px;
  padding: 50px;
  opacity: 0;
  animation-delay: 0.2s;
  animation-name: fadein;
  animation-duration: 0.7s;
  animation-fill-mode: forwards;
  color: white;
}

@keyframes fadein {
  from { opacity: 0}
  to   { opacity: 1}
}
</style>

