import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { RoomsController } from './rooms.controller';
import { RoomsGateway } from './rooms.gateway';
import { RoomsService } from './rooms.service';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from 'libs/common';
import { EmailProcessor } from './email.processor';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [
    MailerModule,
    BullModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        url: configService.get('REDIS_STORE'),
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: true,
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'email-queue',
    }),
  ],
  controllers: [RoomsController],
  providers: [RoomsService, RoomsGateway, SocketService, EmailProcessor],
})
export class RoomsModule {}
