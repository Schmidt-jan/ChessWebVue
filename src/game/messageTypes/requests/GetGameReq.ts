import {RequestMessage, RequestMessageTypes} from "./RequestMessage";

export class GetGameReq implements RequestMessage<null>{
    data: null;
    type: RequestMessageTypes;

    constructor() {
        this.type = 'GetGame';
        this.data = null;
    }
}