import { ServerUnaryCall } from "@grpc/grpc-js"

export namespace IChat{

    // Private
    type OmitIdInSendMsg = Omit<SendToUser, "toID">

    interface MySubjectNextFuction{
        next(value: IChat.ReceiveMsg): void
    }

    // Public
    export type OmitContextConnectionInGetUser = Omit<User, "contextConnection">

    export type CreateUser = {
        user: string
    }

    export interface User extends CreateUser{
        id: number,
        contextConnection: ServerUnaryCall<any, any>,
        subject?: MySubjectNextFuction
    }

    export interface SendToUser{
        from: string
        toID: number
        msg: string
    }

    // Response

    export type ResponseCreateUser = {
        error: string
        userCreated: boolean
    }

    export interface ResponseGetAll{
        users: OmitContextConnectionInGetUser[]
    }

    export interface ReceiveMsg extends OmitIdInSendMsg{}
}