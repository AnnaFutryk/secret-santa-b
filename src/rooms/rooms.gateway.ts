import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { WishesService } from "src/wishes/wishes.service";
import { RoomsService } from "./rooms.service";


@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
@Injectable()
export class RoomsGateway {
  @WebSocketServer() server: Server;

  constructor(
    private readonly roomService: RoomsService,
    private readonly wishesService: WishesService,
    private readonly jwt: JwtService
  ) {}

  @SubscribeMessage('connected')
  connected(@MessageBody() text:string) {
    console.log(text)
  }


  @SubscribeMessage('join-room')
  async handleJoinRoom(@MessageBody() room: string, @ConnectedSocket() socket: Socket) {
    const decodedRoomId = this.jwt.verify(room)
    const roomId = decodedRoomId.roomId
    socket.join(roomId);

    const updatedRoom = await this.roomService.getRoomById(roomId);

    // Відправляємо оновлення всім користувачам цієї кімнати
    this.server.to(roomId).emit('user-joined', updatedRoom);
  }


  // @SubscribeMessage('add-wish')
  // async addWish(@MessageBody() data: { roomId: string, token: string, content: string }) {
  //   const { roomId, token, content } = data;

  //   // Створення або оновлення бажання
  //   await this.wishesService.createOrUpdateWish(roomId, { content }, token);

  //   // Отримуємо актуальну інформацію про кімнату після зміни побажання
  //   const updatedRoom = await this.roomService.getRoomById(roomId);

  //   // Повідомлення всім користувачам цієї кімнати про оновлення бажання
  //   this.server.to(roomId).emit('wish-updated', updatedRoom);
  // }
}
