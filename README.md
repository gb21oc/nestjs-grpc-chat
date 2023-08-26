![Alt text](images/image.png)

# Configuration
- **Port**: 50051
- **Proto files**:
  - /proto/chat.proto
- **Transport**: gRPC

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
