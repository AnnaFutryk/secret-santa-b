
import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { NotFoundException } from '@nestjs/common';

import { Injectable } from '@nestjs/common/decorators';
import { Job } from 'bull';
import { ConfigService, PrismaService } from 'libs/common';
import { join } from 'path';

@Injectable()
@Processor('email-queue')
export class EmailProcessor {
  constructor(
    private readonly mailer: MailerService,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  @Process('send-email')
  async sendEmail(job: Job<{ roomId: string; userId: string; user: string }>) {
    const { roomId, userId, user } = job.data;

    const chooser = await this.prisma.user.findUnique({ where: { id: user } });
    if (!chooser) {
      throw new NotFoundException('User is not find to send email');
    }

    const choosedUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    const userAddress = await this.prisma.address.findUnique({
      where: {
        userId_roomId: {
          userId,
          roomId,
        },
      },
    });

    const userWish = await this.prisma.wish.findUnique({
      where: {
        userId_roomId: {
          userId,
          roomId,
        },
      },
    });


    try {
        const address = userAddress?.content || 'Наразі немає адреси(';
        const wish = userWish?.content || 'Наразі немає бажання(';


        await this.mailer.sendMail({
          to: chooser.email,
          from: this.config.get('MAILER_FROM'),
          subject: 'Інформація про Учасника',
          template: join(process.cwd(), 'templates', 'template'),
          context: {
            name: choosedUser.name,
            address: address,
            wish: wish,
          },
        });
        console.log("sended", {address,wish,name: chooser.name})
      } catch (error) {
        console.log('Error sending email:', error);
      }
      
  }
}
