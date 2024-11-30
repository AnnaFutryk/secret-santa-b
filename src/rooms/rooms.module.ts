import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { RoomsController } from './rooms.controller';
import { RoomsGateway } from './rooms.gateway';
import { RoomsService } from './rooms.service';

@Module({
  controllers: [RoomsController],
  providers: [RoomsService, RoomsGateway, SocketService],
})
export class RoomsModule {}
