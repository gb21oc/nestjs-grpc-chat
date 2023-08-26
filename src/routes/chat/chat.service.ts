import { ServerUnaryCall } from "@grpc/grpc-js";
import { Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { Observable, Subject } from "rxjs";
import { IChat } from "src/common/interfaces/chat.interface";
import { ChatServiceDomain } from "src/domain/chat/chat.service.domain";

interface AttempsMsg{
    toUser: IChat.User
    messagePayload: IChat.ReceiveMsg
}


@Injectable()
export class ChatService implements ChatServiceDomain{

    private readonly users: IChat.User[] = []
    private readonly attempsMsg: AttempsMsg[] = []

    createUser(payload: IChat.CreateUser, call: ServerUnaryCall<IChat.CreateUser, IChat.ResponseCreateUser>){
        const userExists = this.users.findIndex(v => v.user === payload?.user) === -1
        if(payload.user && userExists){
            const usersData: IChat.User = {
                id: this.users.length + 1,
                user: payload.user,
                contextConnection: call
            }
            this.users.push(usersData)
            return {
                error: "",
                userCreated: true
            }
        }
        return {
            error: userExists && payload.user? "User already exists" :"User not created",
            userCreated: false
        }
    }

    getAllUsers(): IChat.ResponseGetAll{
        const getOnlyUsers: IChat.OmitContextConnectionInGetUser[] = this.users.map(({contextConnection, ...json}) => json)
        return {
            users: getOnlyUsers
        }
    }

    joinChat(payload: Observable<IChat.SendToUser>): Observable<IChat.ReceiveMsg>{
        const subject = new Subject<IChat.ReceiveMsg>();
        payload.subscribe({
            next: (payload) => {
                const fromUser = this.users.find(v => v.user === payload.from)
                if(this.users.length === 0 || !fromUser) return subject.error(new RpcException(!fromUser? "User entered does not exist" :"No users"))
                if(!fromUser.subject) fromUser.subject = subject
                if(this.attempsMsg.length !== 0){
                    this.attempsMsg.forEach(msg => {
                        const messagePayload: IChat.ReceiveMsg = {
                            from: msg.messagePayload.from,
                            msg: msg.messagePayload.msg
                        }
                        msg.toUser.subject.next(messagePayload)
                    })
                }
                const userTo = this.users.find(v => v.id === payload.toID)
                if(!userTo || userTo.id === fromUser.id && userTo.user === fromUser.user) {
                    subject.error(new RpcException(!userTo? "User to send message not exists" :"It is not possible to send a message to yourself"))
                    return subject.complete()
                }
                const messagePayload: IChat.ReceiveMsg = {
                    from: payload.from,
                    msg: payload.msg
                }
                if(userTo.subject) userTo.subject.next(messagePayload)
                else {
                    this.attempsMsg.push({
                        messagePayload: messagePayload,
                        toUser: userTo
                    })
                    return subject.next({
                        from: "Server",
                        msg: "Waiting for user to connect!"
                    })
                }
            },
            complete: () => {
                subject.complete();
            },
        });
        return subject.asObservable();
    }
}