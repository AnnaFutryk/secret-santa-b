import { Module } from '@nestjs/common';
import { ConfigModule, PrismaModule } from 'libs/common';
import { AuthModule } from './auth/auth.module';
import { RoomsModule } from './rooms/rooms.module';
import { WishesModule } from './wishes/wishes.module';

@Module({
  imports: [ConfigModule, PrismaModule, AuthModule, WishesModule, RoomsModule],
})
export class AppModule {}
