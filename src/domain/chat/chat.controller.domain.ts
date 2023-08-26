import { Metadata, ServerUnaryCall } from "@grpc/grpc-js";
import { Observable } from "rxjs";
import { IChat } from "src/common/interfaces/chat.interface";

export interface ChatControllerDomain{
    /**
     * Method responsible for creating a user and storing it in memory
     * @param data user payload
     * @param _metadata connection metadata
     * @param call ?
     */
    createUser(data: IChat.CreateUser, _metadata: Metadata, call: ServerUnaryCall<IChat.CreateUser, IChat.ResponseCreateUser>): IChat.ResponseCreateUser

    /**
     * Method responsible for returning all registered users
     */
    getAllUsers(): IChat.ResponseGetAll

    /**
     * Method responsible for opening a persistent connection so that messages can be sent and received
     * @param data user data
     */
    sendMessageToUser(data: Observable<IChat.SendToUser>): Observable<IChat.ReceiveMsg>
}