import { ServerUnaryCall } from "@grpc/grpc-js"

export namespace IChat{

    // Private
    type OmitIdInSendMsg = Omit<SendToUser, "toID">

    interface MySubjectNextFuction{
        next(value: IChat.ReceiveMsg): void
    }

    // Public
    export type OmitContextConnectionInGetUser = Omit<User, "contextConnection">

    /**
     * User created, enter your name
     */
    export type CreateUser = {
        user: string
    }

    /**
     * User information
     */
    export interface User extends CreateUser{
        /**
        * Identifier
        */
        id: number,

        /**
         * Connection information
         */
        contextConnection: ServerUnaryCall<any, any>,

        /**
         * Multicast from Observable
         */
        subject?: MySubjectNextFuction
    }

    /**
     * Information to send message
     */
    export interface SendToUser{
        /**
         * Name of the user who will send the message
         */
        from: string

        /**
         * Id that receive message
         */
        toID: number

        /**
         * Message
         */
        msg: string
    }

    // Response

    /**
     * User creation answer
     */
    export type ResponseCreateUser = {
        /**
         * Msg of error
         */
        error: string

        /**
         * If true, the user was created successfully
         */
        userCreated: boolean
    }

    /**
     * Return all users created
     */
    export interface ResponseGetAll{
        users: OmitContextConnectionInGetUser[]
    }

    /**
     * Return message information
     */
    export interface ReceiveMsg extends OmitIdInSendMsg{}
}