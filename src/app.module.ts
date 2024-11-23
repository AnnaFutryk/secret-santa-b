import { Module } from '@nestjs/common';
import { ConfigModule, PrismaModule } from 'libs/common';
import { AuthModule } from './auth/auth.module';
import { RoomModule } from './room/room.module';
import { WishesModule } from './wishes/wishes.module';

@Module({
  imports: [ConfigModule, PrismaModule, AuthModule, WishesModule, RoomModule],
})
export class AppModule {}
