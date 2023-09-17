import { Test, TestingModule } from "@nestjs/testing";
import { ChatService } from "../chat.service";
import { IChat } from "src/common/interfaces/chat.interface";

describe("Chat Service", () => {
    let moduleRef: TestingModule;
    let chatService: ChatService;

    beforeAll(async () => {
        moduleRef = await Test.createTestingModule({
            providers: [
                ChatService
            ],
          }).compile();
    
        chatService = moduleRef.get<ChatService>(ChatService);
    });

    describe("Defined", () => {
        it("should return success in defined service", () => {
            expect(chatService).toBeDefined()
        })
    })

    describe("Create User", () => {
        it("should return true in created user", async () => {
            const payload: IChat.CreateUser =  {
                user: "gb"
            }
            const res = chatService.createUser(payload, undefined)
            console.log(chatService.getAllUsers())
            expect(res).toStrictEqual(
                expect.objectContaining({
                    error: expect.any(String),
                    userCreated: expect.any(Boolean)
                })
            )
        })
    })

    describe("Get all users", () => {
        it("should return user created", async () => {
            const res = chatService.getAllUsers()
            expect(res.users).toStrictEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        id: expect.any(Number),
                        user: expect.any(String)
                    })
                ])
            )
        })
    })

    afterAll(() => {
        moduleRef.close()
    })
})