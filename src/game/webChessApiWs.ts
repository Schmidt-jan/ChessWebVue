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
    private static queue: unknown[] = [];
    private static onOpenDefined = false;

    public static createNewGame(ws: WebSocket) {
        this.send(ws, new NewGameReq())
    }

    public static movePiece(ws: WebSocket, move: MovePiece) {
        this.send(ws, new MovePieceMessage(move));
    }

    public static convertPawn(ws: WebSocket, toFigure: string) {
        this.send(ws, new ConvertPawnReq(toFigure))
    }

    private static send(ws: WebSocket, message: unknown) {
        this.queue.push(message);

        if (ws.readyState !== 1) {
            if (!this.onOpenDefined) {
                ws.onopen = () => {
                    for (const mes of this.queue) {
                        ws.send(JSON.stringify(mes));
                    }
                }
            }
        } else {
            ws.send(JSON.stringify(message));
        }
    }
}