import { Module } from '@nestjs/common';
import { ConfigModule, PrismaModule } from 'libs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [ConfigModule, PrismaModule, AuthModule, UserModule],
})
export class AppModule {}
