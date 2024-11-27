import { Module } from '@nestjs/common';
import { WishesService } from 'src/wishes/wishes.service';
import { RoomsController } from './rooms.controller';
import { RoomsGateway } from './rooms.gateway';
import { RoomsService } from './rooms.service';

@Module({
  controllers: [RoomsController],
  providers: [RoomsService,RoomsGateway,WishesService],
})
export class RoomsModule {}
