import { ServerUnaryCall } from "@grpc/grpc-js";
import { Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { Observable, Subject } from "rxjs";
import { IChat } from "src/common/interfaces/chat.interface";
import { ChatServiceDomain } from "src/domain/chat/chat.service.domain";

@Injectable()
export class ChatService implements ChatServiceDomain{

    private readonly users: IChat.User[] = []
    private readonly attempsMsg: IChat.AttempsMsg[] = []

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
            } as IChat.ResponseCreateUser
        }
        return {
            error: userExists && payload.user? "User already exists" :"User not created",
            userCreated: false
        } as IChat.ResponseCreateUser
    }

    getAllUsers(): IChat.ResponseGetAll{
        const getOnlyUsers: IChat.OmitContextConnectionInGetUser[] = this.users.map(({contextConnection, ...json}) => json)
        return {
            users: getOnlyUsers
        }
    }

    joinChat(payload: Observable<IChat.SendToUser>): Observable<IChat.ReceiveMsg>{
        const subjectChat = new Subject<IChat.ReceiveMsg>();
        let fromUser: IChat.User;
        let userTo: IChat.User;
        payload.subscribe({
            next: (payload) => {
                fromUser = this.users.find(v => v.user === payload.from)
                if(this.users.length === 0 || !fromUser) return subjectChat.error(new RpcException(!fromUser? "User entered does not exist" :"No users"))
                if(!fromUser.subject) fromUser.subject = subjectChat
                if(this.attempsMsg.length !== 0){
                    this.attempsMsg.forEach((msg, index) => {
                        const messagePayload: IChat.ReceiveMsg = {
                            from: msg.messagePayload.from,
                            msg: msg.messagePayload.msg
                        }
                        msg.toUser.subject.next(messagePayload)
                        this.attempsMsg.splice(index, 1)
                    })
                }
                userTo = this.users.find(v => v.id === payload.toID)
                if(!userTo || userTo.id === fromUser.id && userTo.user === fromUser.user) {
                    subjectChat.error(new RpcException(!userTo? "User to send message not exists" :"It is not possible to send a message to yourself"))
                    return subjectChat.complete()
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
                    return subjectChat.next({
                        from: "Server",
                        msg: "Waiting for user to connect!"
                    })
                }
            },
            complete: () => {
                delete fromUser.subject
                if(userTo.subject) userTo.subject.next(
                    {
                        from: "Server",
                        msg: `${userTo.user} disconnected!`
                    }
                )
                subjectChat.complete();
            },
        });
        return subjectChat.asObservable();
    }
}