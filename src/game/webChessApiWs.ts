import {NewGameReq} from "./messageTypes/requests/NewGameReq";
import {ConvertPawnReq} from "./messageTypes/requests/ConvertPawnReq";
import {MovePieceMessage} from "./messageTypes/requests/MovePieceReq";

export interface MovePiece {
    fromX: number
    toX: number
    fromY: number
    toY: number
}
export class WebChessApiWs {
    public static createNewGame(ws: WebSocket) {
        console.log("create new game")
        ws.send(JSON.stringify(new NewGameReq()));
    }

    public static movePiece(ws: WebSocket, move: MovePiece) {
        ws.send(JSON.stringify(new MovePieceMessage(move)));
    }

    public static convertPawn(ws: WebSocket, toFigure: string) {
        ws.send(JSON.stringify(new ConvertPawnReq(toFigure)))
    }
}