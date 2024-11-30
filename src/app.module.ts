import { Module } from '@nestjs/common';
import { ConfigModule, PrismaModule } from 'libs/common';
import { AuthModule } from './auth/auth.module';
import { RoomsModule } from './rooms/rooms.module';

@Module({
  imports: [ConfigModule, PrismaModule, AuthModule, RoomsModule],
})
export class AppModule {}
