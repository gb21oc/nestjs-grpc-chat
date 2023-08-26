import { Metadata, ServerUnaryCall } from "@grpc/grpc-js";
import { Observable } from "rxjs";
import { IChat } from "src/common/interfaces/chat.interface";

export interface ChatControllerDomain{
    /**
     * Metodo responsavel por criar um usuario e armazenar em memoria
     * @param data payload do usuario
     * @param _metadata metadados da conexao
     * @param call ?
     */
    createUser(data: IChat.CreateUser, _metadata: Metadata, call: ServerUnaryCall<IChat.CreateUser, IChat.ResponseCreateUser>): IChat.ResponseCreateUser

    /**
     * Metodo responsavel por retornar todos os usuario cadastrados
     */
    getAllUsers(): IChat.ResponseGetAll

    /**
     * Metodo responsavel por abrir uma conexao persistente para que seja possivel enviar e receber as mensagens
     * @param data dados do usuario
     */
    sendMessageToUser(data: Observable<IChat.SendToUser>): Observable<IChat.ReceiveMsg>
}