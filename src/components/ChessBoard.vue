<template>
  <h1>Hello</h1>
  <div>
    <div id="3dGame"/>
  </div>
</template>

<script>
import {ChessBoard} from "@/game/ChessBoard";
import {Player} from "@/game/models/GameField";

export default {
  mounted() {
    const ws = new WebSocket('ws://localhost:9000/ws');
    const parent = document.getElementById('3dGame')
    const chessBoard = new ChessBoard(Player.White, parent, ws, true);
  }





}
</script>
<style scoped>
#3dGame {
  width: 800px;
  height: 800px;
}
</style>