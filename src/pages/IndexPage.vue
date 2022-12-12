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
        :gameField="gameField"
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
import {FigureTypes, GameFieldResponse, Player} from "@/game/models/GameField";
import {KeepAliveReq} from "@/game/messageTypes/requests/KeepAliveReq";
import PopupSwitchPawn from "@/components/PopupSwitchPawn.vue";
import {WebChessApiWs} from "@/game/webChessApiWs";
import {defineComponent} from "vue";
import {StatusUpdateRes} from "@/game/messageTypes/responses/StatusUpdateRes";
import {ResponseMessage} from "@/game/messageTypes/responses/ResponseMessage";
import {GameFieldRes} from "@/game/messageTypes/responses/GameFieldRes";


let ws = new WebSocket('ws://localhost:9000/ws');
setInterval(() => {
  const keepAlive: KeepAliveReq = new KeepAliveReq();
  ws.send(JSON.stringify(keepAlive))
}, 10000)

let switches: FigureTypes[] = [];
let gameField: GameFieldResponse | undefined = undefined;

export default defineComponent({
  name: 'IndexPage',
  components: {
    PopupColorChooser,
    PopupSwitchPawn,
    ChessField
  },
  created() {
    ws.onmessage = (evt) => {
      this.processMessage(evt)
    }
  },
  data() {
    return {
      ws: ws,
      colorChooserVisible : true,
      switchPawnVisible : false,
      figureSwitches: switches,
      gameField: gameField
    }
  },
  methods: {
    colorSelected(color: string) {
      if (color === 'BLACK') {
        (this.$refs.chessFieldComponent as typeof ChessField).setPlayer(Player.Black)
      } else {
        (this.$refs.chessFieldComponent as typeof ChessField).setPlayer(Player.White)
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
      this.figureSwitches = (this.$refs.chessFieldComponent as typeof ChessField).getPossibleSwitches()
      this.switchPawnVisible = true;
    },
    processMessage(msg: MessageEvent) {
      let message = JSON.parse(msg.data) as ResponseMessage<unknown>;
      if (message.type === 'GameField') {
        this.gameField = (message as GameFieldRes).data
      } else if (message.type === 'StatusUpdate') {
        this.statusUpdate(message as StatusUpdateRes);
      }
    }
  }


})
</script>