<template>
  <div id="popupColorChooser" class="d-flex justify-content-center align-items-center">
    <div id="popup">
      <div class="d-flex justify-content-center">
        <h2>Choose a color</h2>
      </div >
      <div class="chooser">
        <button id="btnWhiteColorChooser" class="btn btn-light" @click="selectColor('WHITE')">
          <p class="icon">♔</p>
          <p>WHITE</p>
        </button>
        <button id="btnBlackColorChooser" class="btn btn-light" @click="selectColor('BLACK')">
          <p class="icon">♚</p>
          <p>BLACK</p>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent( {
  name: 'PopupColorChooser',
  methods: {
    selectColor(color: string) {
      this.$emit('selectColor', color);
    },
  },
});
</script>

<style>
.chooser > button {
  margin: 20px;
}

.chooser > button > .icon {
  font-size: 100px;
}

#popupColorChooser {
  background: rgb(0, 0, 0, 0.5);
  z-index: 100;
  position: absolute;
  width: 100%;
  height: 100%;
}

#popup {
  background: #606bb6c2;
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

