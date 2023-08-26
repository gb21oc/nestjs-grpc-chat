import { Observable } from "rxjs";
import { Controller } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { Metadata, ServerUnaryCall } from "@grpc/grpc-js";
import { IChat } from "src/common/interfaces/chat.interface";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { ChatControllerDomain } from "src/domain/chat/chat.controller.domain";

@Controller()
export class ChatController implements ChatControllerDomain{
    /**
     *
     */
    constructor(
        private readonly _chatService: ChatService
    ) {}
    

    @GrpcMethod("Chat")
    createUser(data: IChat.CreateUser, _metadata: Metadata, call: ServerUnaryCall<IChat.CreateUser, IChat.ResponseCreateUser>): IChat.ResponseCreateUser{
        return this._chatService.createUser(data, call)
    }

    @GrpcMethod("Chat")
    getAllUsers(): IChat.ResponseGetAll{
        return this._chatService.getAllUsers()
    }

    @GrpcStreamMethod("Chat")
    sendMessageToUser(data: Observable<IChat.SendToUser>){
        return this._chatService.joinChat(data)
    }
}