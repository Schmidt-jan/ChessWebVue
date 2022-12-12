<template>
  <div id="index">
    <PopupColorChooser
        v-if="colorChooserVisible"
        @selectColor="colorSelected"
    />
    <PopupSwitchPawn
        v-if="switchPawnVisible"
        :figureConversion="figureSwitches"
        @switchPawn="switchPawn"
    />
    <ChessField
        :ws="ws"
        ref="chessFieldComponent"
        @statusUpdate="statusUpdate"
    />
  </div>
</template>

<style>
#index {
  display: flex;
  align-items: center;
  justify-content: center;
  float: left
}
</style>

<script lang="ts">
import PopupColorChooser from "@/components/PopupColorChooser.vue";
import ChessField from "@/components/ChessField.vue";
import {FigureTypes, Player} from "@/game/models/GameField";
import {KeepAliveReq} from "@/game/messageTypes/requests/KeepAliveReq";
import PopupSwitchPawn from "@/components/PopupSwitchPawn.vue";
import {WebChessApiWs} from "@/game/webChessApiWs";
import {defineComponent} from "vue";
import {ResponseMessage} from "@/game/messageTypes/responses/ResponseMessage";
import {GameFieldRes} from "@/game/messageTypes/responses/GameFieldRes";
import {StatusTypes, StatusUpdateRes} from "@/game/messageTypes/responses/StatusUpdateRes";
import {ChessGameField} from "@/game/move_calculator";

let ws = new WebSocket('ws://localhost:9000/ws');
setInterval(() => {
  const keepAlive: KeepAliveReq = new KeepAliveReq();
  ws.send(JSON.stringify(keepAlive))
}, 10000)

let switches: FigureTypes[] = [];

export default defineComponent({
  name: 'IndexPage',
  components: {
    PopupColorChooser,
    PopupSwitchPawn,
    ChessField
  },
  data() {
    return {
      ws: ws,
      colorChooserVisible : true,
      switchPawnVisible : false,
      figureSwitches: switches
    }
  },
  methods: {
    colorSelected(color: string) {
      if (color === 'BLACK') {
        this.$refs.chessFieldComponent.setPlayer(Player.Black)
      } else {
        this.$refs.chessFieldComponent.setPlayer(Player.White)
      }
      this.colorChooserVisible = false;
    },
    switchPawn(toFigure: FigureTypes) {
      WebChessApiWs.convertPawn(ws, toFigure)
      this.switchPawnVisible = false
    },
    statusUpdate(message: StatusUpdateRes) {
      console.log('Emit called')
      if (message.data.status === "PAWN HAS REACHED THE END") {
        console.log('Pawn has reached end')
      } else if (message.data.status  === "INVALID MOVE") {
        this.updateFigureSwitches()
      }
    },
    updateFigureSwitches() {
      this.figureSwitches = this.$refs.chessFieldComponent.getPossibleSwitches()
      this.switchPawnVisible = true;
    }
  }


})
</script>