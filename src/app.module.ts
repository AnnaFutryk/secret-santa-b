import { Module } from '@nestjs/common';
import { ConfigModule, PrismaModule } from 'libs/common';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule,PrismaModule,AuthModule],
})
export class AppModule {}
