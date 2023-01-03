export type RequestMessageTypes = "NewGame" | "GetGame" | "MovePiece" | "ConvertPawn" | "KeepAlive"

export interface RequestMessage<T> {
    type: RequestMessageTypes,
    data: T
}