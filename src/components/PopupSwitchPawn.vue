<template>
  <div id="popupSwitchPawn" class="d-flex justify-content-center align-items-center">
    <div id="popup">
      <div class="d-flex justify-content-center">
        <h2>Switch pawn to</h2>
      </div >
      <div class="chooser">
        <button id="btnSwitchPawnToQueen" class="btn btn-light" @click="switchPawn('queen')"
                :disabled="!possibleSwitches.includes(FigureTypes.Queen)">
          <p class="icon">♕</p>
          <p>Queen</p>
        </button>
        <button id="btnSwitchPawnToBishop" class="btn btn-light" @click="switchPawn('bishop')"
                :disabled="!possibleSwitches.includes(FigureTypes.Bishop)">
          <p class="icon">♗</p>
          <p>Bishop</p>
        </button>
        <button id="btnSwitchPawnToRook" class="btn btn-light" @click="switchPawn('rook')"
                :disabled="!possibleSwitches.includes(FigureTypes.Rook)">
          <p class="icon">♖</p>
          <p>Rook</p>
        </button>
        <button id="btnSwitchPawnToKnight" class="btn btn-light" @click="switchPawn('knight')"
                :disabled="!possibleSwitches.includes(FigureTypes.Knight)">
          <p class="icon">♘</p>
          <p>Knight</p>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {defineProps, toRefs, withDefaults, defineEmits} from "vue";
import {FigureTypes} from "@/game/models/GameField";

interface Props {
  figureConversion: FigureTypes[]
}

const props = withDefaults(defineProps<Props>(), {
  figureConversion: () => [FigureTypes.Queen]
});

const emit = defineEmits(['switchPawn'])

let possibleSwitches = toRefs(props).figureConversion.value;

function switchPawn(toFigure: string) {
  emit('switchPawn', toFigure);
}
</script>

<style scoped>
#popupSwitchPawn {
  background: rgb(0, 0, 0, 0.5);
  z-index: 100;
  position: absolute;
  width: 100%;
  height: 100%;
}

button {
  stroke: black;
}

button:disabled {
  background: gray;
}
</style>