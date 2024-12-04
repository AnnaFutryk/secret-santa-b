import { MailerModule as NodeMailer } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigService } from 'libs/common';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

@Module({
  imports: [
    NodeMailer.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAILER_HOST'),
          port: 587,
          secure: false,
          auth: {
            user: configService.get('MAILER_USERNAME'),
            pass: configService.get('MAILER_PASSWORD'),
          },
        },
        template: {
          dir: join(process.cwd(), 'templates'),
          adapter: new HandlebarsAdapter(),
          options: { strict: true },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [NodeMailer],
})
export class MailerModule {}
