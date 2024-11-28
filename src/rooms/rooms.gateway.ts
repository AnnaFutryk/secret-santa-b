import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { SocketService } from "./socket.service";
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
    private readonly socketService: SocketService,
    private readonly jwt: JwtService
  ) {
   
  }

  @SubscribeMessage('connected')
  connected(@MessageBody() text:string) {
    console.log(
      text
    )
  }

@SubscribeMessage('connect-room')
connectToRoom(@MessageBody() roomId: string, @ConnectedSocket() socket: Socket) {
  socket.join(roomId);
  socket.emit("room", roomId)
  console.log('Користувач підключений до кімнати: ' + roomId);
}


  @SubscribeMessage('join-room')
async handleJoinRoom(@MessageBody() {room, sessionToken}:{room:string, sessionToken: string}, @ConnectedSocket() socket: Socket) {
  const decodedRoomId = this.jwt.verify(room)
  const roomId = decodedRoomId.roomId

  console.log(roomId)
  socket.join(roomId)
  const decodedUserId = this.jwt.verify(sessionToken)
  const userId = decodedUserId.id
  let updatedRoom
  try {
      await this.roomService.joinRoom(roomId,userId)
      updatedRoom = await this.roomService.getRoomById(roomId)
      console.log('Room updated:', updatedRoom)
  } catch (error) {
    console.error('Error joining room:', error)
    this.server.to(socket.id).emit('room-joined', { success: false, message: 'Failed to join room' })
  }

  this.server.to(socket.id).emit('room-joined', { success: true, roomId })
  
  this.server.emit('room-updated', updatedRoom); 

}



  @SubscribeMessage('wish')
  async addWish(@MessageBody() data: { roomId: string, token: string, content: string }) {
    const { roomId, token, content } = data;
    await this.socketService.createOrUpdateWish(roomId, { content }, token);
    const updatedRoom = await this.roomService.getRoomById(roomId);
    this.server.to(roomId).emit('room-updated', updatedRoom);
  }

  @SubscribeMessage('address')
  async addAddress(@MessageBody() data: { roomId: string, token: string, content: string }) {
    const { roomId, token, content } = data;
    await this.socketService.createOrUpdateAddress(roomId, { content }, token);
    const updatedRoom = await this.roomService.getRoomById(roomId);
    this.server.to(roomId).emit('room-updated', updatedRoom);
  }
}
