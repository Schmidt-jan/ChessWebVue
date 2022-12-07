import {RequestMessage, RequestMessageTypes} from "./RequestMessage";

export class ConvertPawnReq implements RequestMessage<string>{
    data: string;
    type: RequestMessageTypes;

    constructor(toFigure: string) {
        this.type = 'ConvertPawn';
        this.data = toFigure;
    }
}