import {createApp} from 'vue'
import App from './App.vue'
import {Router} from "@/router";


import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

const app = createApp(App);
app.use(Router);
app.mount('#app')

/*
const ws = new WebSocket('ws://localhost:9000/ws');
let board: ChessBoard;
let game3d : HTMLElement;

function initElements() {
    const _game3d = document.getElementById('3dGame');
    if (!_game3d) {
        throw new Error(`Couldn't find id '3dGame'`);
    }
    game3d = _game3d;
}

function init() {
    initElements()
    board = new ChessBoard(Player.White, game3d, ws, true);

    game3d.addEventListener('click', (evt) => board.onClick(evt, board))
    game3d.addEventListener('drag', (evt) => board.onClick(evt, board))
    window.addEventListener('resize', () => board.onWindowResize(board));

    board.startAnimation();
    board.loadFigures().then(() => {
        WebChessApiWs.createNewGame(ws)
    })
}

ws.onmessage = function (event) {
    if (!board || !board.figuresLoaded) {
        return
    }
    let message = JSON.parse(event.data) as ResponseMessage<any>;

    switch (message.type) {
        case "GameField":
            message = message as GameFieldRes
            updateGameField(message.data)
            break;
        case "StatusUpdate":
            message = message as StatusUpdateRes;
            //updateStatus(message.data)
            break;
    }

}


async function updateGameField(response: GameFieldResponse) {
    const chessField = new ChessGameField(response);
    board.updateField(chessField);

    //await updateStatus(response as StatusUpdate)
}

setInterval(() => {
    const keepAlive: KeepAliveReq = new KeepAliveReq();
    ws.send(JSON.stringify(keepAlive))
}, 10000);

requestAnimationFrame(() => {
    if (board) {
        board.render
    }
});

window.onload = init

*/