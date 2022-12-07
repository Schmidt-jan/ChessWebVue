import {RequestMessage, RequestMessageTypes} from "./RequestMessage";
import {MovePiece} from "@/game/webChessApiWs";

export class MovePieceMessage implements RequestMessage<MovePiece>{
    data: MovePiece;
    type: RequestMessageTypes;

    constructor(move: MovePiece) {
        this.type = 'MovePiece';
        this.data = move;
    }
}