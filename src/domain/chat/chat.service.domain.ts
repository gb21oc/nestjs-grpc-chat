import { ServerUnaryCall } from "@grpc/grpc-js";
import { IChat } from "src/common/interfaces/chat.interface";
import { ChatControllerDomain } from "./chat.controller.domain";
import { Observable } from "rxjs";

export interface ChatServiceDomain extends Omit<ChatControllerDomain, "createUser" | "sendMessageToUser">{
    /**
     * Responsavel pela validação e inserção do usuario
     * @param payload 
     * @param call 
     */
    createUser(payload: IChat.CreateUser, call: ServerUnaryCall<IChat.CreateUser, IChat.ResponseCreateUser>): IChat.ResponseCreateUser

    /**
     * Responsavel por realizar a validação da regra de negocio e realizar o streaming das mensagens
     * @param payload 
     */
    joinChat(payload: Observable<IChat.SendToUser>): Observable<IChat.ReceiveMsg>
}