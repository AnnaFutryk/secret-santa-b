import { Module } from '@nestjs/common';
import { ConfigModule, PrismaModule } from 'libs/common';

@Module({
  imports: [ConfigModule,PrismaModule],
})
export class AppModule {}
