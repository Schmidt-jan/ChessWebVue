<style>
#index {
  display: flex;
  align-items: center;
  justify-content: center;
  float: left
}


.hudButtons {
  border-radius: 10px;
  min-height: 2vw;
  min-width: 2vw;
  pointer-events: all;
  margin: 1vh;
}

.top_left {
  left: 0;
  top: 0;
  position: absolute;
}

.bottom_right {
  right: 0;
  bottom: 0;
  position: absolute;
}

.bottom_left {
  left: 0;
  bottom: 0;
  position: absolute;
}

.btn-light {
  --bs-btn-color: #fff !important;
  --bs-btn-bg: #5D69B7E5 !important;
  --bs-btn-border-color: rgba(248, 249, 250, 0) !important;
  --bs-btn-hover-color: #fff !important;
  --bs-btn-hover-bg: #545fabe5 !important;
  /* --bs-btn-hover-border-color: #c6c7c8; */
  --bs-btn-focus-shadow-rgb: 211, 212, 213 !important;
  --bs-btn-active-color: #e5e5e5 !important;
  --bs-btn-active-bg: #4f5aa5e5 !important;
  /* --bs-btn-active-border-color: #babbbc; */
  /* --bs-btn-active-shadow: inset 0 3px 5pxrgba(0, 0, 0, 0.125); */
  /* --bs-btn-disabled-color: #000; */
  /* --bs-btn-disabled-bg: #f8f9fa; */
  /* --bs-btn-disabled-border-color: #f8f9fa; */
}

html{
  background: #4d59a4;
}

.hud {
  z-index: 2;
  min-height: 100vh;
  min-width: 100vw;
  pointer-events: none;

  opacity: 0;
  animation-delay: 1s;
  animation-name: fadein;
  animation-duration: 2s;
  animation-fill-mode: forwards;
}

@keyframes fadein {
  from {
    opacity: 0
  }
  to {
    opacity: 1
  }
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

import {POSITION, TYPE, useToast} from "vue-toastification";
import {ToastID, ToastOptions} from "vue-toastification/dist/types/types";


import wonComp from "@/components/WonComp.vue";
import LoseComp from "@/components/LoseComp.vue";

const toast = useToast();

enum PLAYER {
  WHITE, BLACK, UNDEFINED
}

let gameEnd = false;

let currentPlayer = PLAYER.UNDEFINED;
let showCurrentPlayer = false;
let activePlayer: PLAYER;
let currentPlayerToast: ToastID;

let ws : WebSocket;
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
    ws = new WebSocket(`${process.env.VUE_APP_API_URL}/ws`);
    ws.onmessage = (evt) => {
      console.log('Received ws message: ' + evt.data);
      this.processMessage(evt)
    }
  },
  data() {
    return {
      ws: ws,
      showHints: true,
      perspective: true,
      colorChooserVisible: true,
      switchPawnVisible: false,
      figureSwitches: switches,
      gameField: gameField
    }
  },
  methods: {
    colorSelected(color: string) {
      if (color === 'BLACK') {
        activePlayer = PLAYER.BLACK;
        (this.$refs.chessFieldComponent as typeof ChessField).setPlayer(Player.Black)
      } else {
        activePlayer = PLAYER.WHITE;
        (this.$refs.chessFieldComponent as typeof ChessField).setPlayer(Player.White)
      }
      this.colorChooserVisible = false;
      showCurrentPlayer = true;
      updateCurrentPlayerToast();
    },
    switchPawn(toFigure: FigureTypes) {
      WebChessApiWs.convertPawn(ws, toFigure)
      this.switchPawnVisible = false
    },
    statusUpdate(message: StatusUpdateRes) {
      toastHandler(message);
      console.log(message.data);
      console.log('Emit called')
      if (message.data.status === "PAWN HAS REACHED THE END") {
        console.log('Pawn has reached end')
      }
    },
    updateFigureSwitches() {
      this.figureSwitches = (this.$refs.chessFieldComponent as typeof ChessField).getPossibleSwitches()
      this.switchPawnVisible = true;
    },
    processMessage(msg: MessageEvent) {
      let message = JSON.parse(msg.data) as ResponseMessage<unknown>;
      if (message.type === 'GameField') {
        console.log(`Message is new GameField`)
        toastHandler(message as StatusUpdateRes);
        this.gameField = (message as GameFieldRes).data
        switch (this.gameField.currentPlayer) {
          case "BLACK":
            currentPlayer = PLAYER.BLACK;
            break;
          case "WHITE":
            currentPlayer = PLAYER.WHITE;
            break;
        }
        updateCurrentPlayerToast();

      } else if (message.type === 'StatusUpdate') {
        this.statusUpdate(message as StatusUpdateRes);
      }
    },
    newGame() {
      toast.clear();
      toast.info("New Game started!", toastOptions
      );
      WebChessApiWs.createNewGame(ws);
    },
    toggleShowHints() {
      var v = (this.$refs.chessFieldComponent as typeof ChessField)
      if (this.showHints) {
        this.showHints = !this.showHints;
        v.toggleShowHints(false)
        toast.info("Possible moves now hidden!", toastOptions);
      } else {
        this.showHints = !this.showHints;
        v.toggleShowHints(true)
        toast.info("Possible moves now shown!", toastOptions);
      }
    },
    setPerspective() {
      var v = (this.$refs.chessFieldComponent as typeof ChessField)
      if (this.perspective) {
        this.perspective = !this.perspective;
        v.setControlSettings(false)
      } else {
        this.perspective = !this.perspective;
        v.setControlSettings(true)
      }
    }
  },

})

let toastOptions: ToastOptions & { type?: undefined } = {
  position: POSITION.TOP_RIGHT,
  timeout: 2000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: "button",
  icon: true,
  rtl: false
}

let toastOptions_ConvertPawn: ToastOptions & { type?: undefined } = {
  position: POSITION.TOP_CENTER,
  timeout: 100000,
  closeOnClick: false,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: false,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: false,
  icon: false,
  rtl: false
}

function updateCurrentPlayerToast() {
  if(!gameEnd){
  toast.dismiss(currentPlayerToast);
  if (currentPlayer !== PLAYER.UNDEFINED && showCurrentPlayer) {
    if (currentPlayer == activePlayer) {
      currentPlayerToast = toast.info("It's YOUR turn!", toastOptions_ConvertPawn);
    } else {
      currentPlayerToast = toast.info("It's the OPPONENT's turn!", toastOptions_ConvertPawn);
    }
  }
  }
}

function toastHandler(status: StatusUpdateRes) {
  //ACTIVE Player
  if (currentPlayer == activePlayer) {
    switch (status.data.status) {
      case "CHECKED":
        toast.warning("You have set the opponent in check.", toastOptions);
        break;
      case "CHECKMATE":
        gameEnd=true;
        toast.clear();
        //toast.success("YOU WON!", toastOptions_ConvertPawn);
        toast(wonComp, toastOptions_ConvertPawn)
        break;
      case "INVALID CONVERSION":
        toast.error("Invalid conversion!", toastOptions);
        break;
      case "PAWN HAS REACHED THE END":
        toast.info("Pawn has reached the end!", toastOptions);
        break;
      case "INVALID MOVE":
        toast.error("Invalid move!", toastOptions);
        break;
    }
  }

  //INACTIVE Player
  else {
    switch (status.data.status) {
      case "CHECKED":
        toast.warning("You were put in check.", toastOptions)
        break;
      case "CHECKMATE":
        gameEnd=true;
        toast.clear();
        //toast(wonComp, toastOptions);
        toast(LoseComp, toastOptions_ConvertPawn)
        break;
    }
  }
}

</script>

<template>
  <div class="outer">
    <div class="inner" id="index">
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
          :showHints="showHints"
          :perspective="perspective"
          ref="chessFieldComponent"
          @statusUpdate="statusUpdate"
      />
    </div>
    <div class="hud inner">
      <div class="bottom_right">
        <button type="button" class="btn btn-light hudButtons square" @click="newGame">New Game</button>
      </div>
      <div class="bottom_left">
        <button type="button" class="btn btn-light hudButtons square" @click="setPerspective">3D</button>
        <button type="button" class="btn btn-light hudButtons square" @click="toggleShowHints">Hints</button>
      </div>
    </div>
  </div>

</template>