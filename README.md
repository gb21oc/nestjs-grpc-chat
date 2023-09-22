![Alt text](images/image.png)

```mermaid
classDiagram
    ChatController <.. ChatService: Dependency
    ChatController <|-- ChatControllerDomain: Inheritance

    class ChatController{
        +ChatService _chatService
        constructor(_chatService: ChatService)
        +createUser(data: IChat.CreateUser, _metadata: Metadata, call: ServerUnaryCall<IChat.CreateUser, IChat.ResponseCreateUser>, ):IChat.ResponseCreateUser
        +getAllUsers():IChat.ResponseGetAll
        +sendMessageToUser(data: Observable<IChat.SendToUser>)
    }
    class ChatService{
        +IChat.User[] users
        +IChat.AttempsMsg[] attempsMsg
        +createUser(payload: IChat.CreateUser, call: ServerUnaryCall<IChat.CreateUser, IChat.ResponseCreateUser>, )
        +getAllUsers():IChat.ResponseGetAll
        +joinChat(payload: Observable<IChat.SendToUser>):Observable<IChat.ReceiveMsg>
    }
```

# Configuration
- **Port**: 50051
- **Proto files**:
  - /proto/chat.proto
- **Transport**: gRPC
- **PRD**: [![Build Status](https://dev.azure.com/gabrieljoseDev77/dev/_apis/build/status%2Fnestjs-grpc-chat-PRD?branchName=main)](https://dev.azure.com/gabrieljoseDev77/dev/_build/latest?branchName=main)
- **DEV**: [![Build Status](https://dev.azure.com/gabrieljoseDev77/dev/_apis/build/status%2Fnestjs-grpc-chat-DEV?branchName=develop)](https://dev.azure.com/gabrieljoseDev77/dev/_build/latest?definitionId=11&branchName=develop)

# Micro Service information
- **Endpoints**
  - **CreateUser**
    - **Interface**: IChat.CreateUser
    - **Stream**: No
    - **Body**:
    ```json
    {
      "user": "gb"
    }
    ```
    - **Response**:
    ```json
    {
      "error": "",
      "userCreated": true
    }
    ```
  - **GetAllUsers**
    - **Interface**: N/A
    - **Stream**: No
    - **Body**: No
    - **Response**:
    ```json
    {
      "users": [
          {
              "id": 1,
              "user": "gb"
          },
          {
              "id": 2,
              "user": "gbOutroUsuario"
          }
      ]
    }
    ```
  - **SendMessageToUser**
    - **Interface**: IChat.SendToUser
    - **Stream**: yes
      - **Bidirecional**: yes
    - **Body**:
    ```json
    {
      "from": "gb",
      "toID": 2,
      "msg": "Olá amigo!"
    }
    ```
