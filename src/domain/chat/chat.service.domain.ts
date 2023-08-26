import { ServerUnaryCall } from "@grpc/grpc-js";
import { IChat } from "src/common/interfaces/chat.interface";
import { ChatControllerDomain } from "./chat.controller.domain";
import { Observable } from "rxjs";

export interface ChatServiceDomain extends Omit<ChatControllerDomain, "createUser" | "sendMessageToUser">{
    /**
     * Responsible for user validation and insertion
     * @param payload 
     * @param call 
     */
    createUser(payload: IChat.CreateUser, call: ServerUnaryCall<IChat.CreateUser, IChat.ResponseCreateUser>): IChat.ResponseCreateUser

    /**
     * Responsible for validating business rules and streaming messages
     * @param payload 
     */
    joinChat(payload: Observable<IChat.SendToUser>): Observable<IChat.ReceiveMsg>
}