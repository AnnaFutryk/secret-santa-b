import { Module } from '@nestjs/common';
import { ConfigModule, PrismaModule } from 'libs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RoomModule } from './room/room.module';

@Module({
  imports: [ConfigModule, PrismaModule, AuthModule, UserModule, RoomModule],
})
export class AppModule {}
