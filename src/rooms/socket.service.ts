import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'libs/common';
import { UserEventDto } from './dto/user-event.dto';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class SocketService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwt: JwtService,
    @InjectQueue('email-queue') private mailerQueue: Queue,
  ) {}

  async createOrUpdateWish(
    roomId: string,
    userUserEventDto: UserEventDto,
    token: string,
  ) {
    const decodedToken = this.jwt.verify(token);
    const userId = decodedToken.id as string;
    const roomExists = await this.prismaService.room.findUnique({
      where: { id: roomId },
    });
    if (!roomExists) {
      throw new NotFoundException('Room тot found');
    }

    const existingWish = await this.prismaService.wish.findUnique({
      where: {
        userId_roomId: {
          userId,
          roomId,
        },
      },
    });

    if (existingWish) {
      return this.prismaService.wish.update({
        where: {
          id: existingWish.id,
        },
        data: {
          content: userUserEventDto.content,
        },
      });
    }

    return this.prismaService.wish.create({
      data: {
        content: userUserEventDto.content,
        userId: userId,
        roomId: roomId,
      },
    });
  }

  async createOrUpdateAddress(
    roomId: string,
    userUserEventDto: UserEventDto,
    token: string,
  ) {
    const decodedToken = this.jwt.verify(token);
    const userId = decodedToken.id;
    const roomExists = await this.prismaService.room.findUnique({
      where: { id: roomId },
    });
    if (!roomExists) {
      throw new NotFoundException('Room тot found');
    }

    const existingAddress = await this.prismaService.address.findUnique({
      where: {
        userId_roomId: {
          userId,
          roomId,
        },
      },
    });

    if (existingAddress) {
      return this.prismaService.address.update({
        where: {
          id: existingAddress.id,
        },
        data: {
          content: userUserEventDto.content,
        },
      });
    }

    return this.prismaService.address.create({
      data: {
        content: userUserEventDto.content,
        userId: userId,
        roomId: roomId,
      },
    });
  }

  async checkStatus(roomId: string, user: string, userId: string) {
    const roomExists = await this.prismaService.room.findUnique({
      where: { id: roomId },
    });

    await this.mailerQueue.add('send-email', {
      roomId,
      userId,
      user,
    });
  

    if (!roomExists) {
      throw new NotFoundException('Room not found');
    }

    const userStatus = await this.prismaService.status.findUnique({
      where: {
        userId_roomId: {
          userId,
          roomId,
        },
      },
      select: { status: true },
    });

    if (!userStatus) {
      throw new NotFoundException('User status not found');
    }

    if (userStatus.status) {
      return { message: 'User status is already true' };
    }

    const updated = await this.prismaService.status.update({
      where: {
        userId_roomId: {
          userId,
          roomId,
        },
      },
      data: {
        status: true,
      },
    });
    try {
      await this.prismaService.isChoosed.update({
        where: {
          userId_roomId: {
            userId: user,
            roomId,
          },
        },
        data: {
          choosed: true,
        },
      });
    } catch (error) {
      console.log(error);
      return;
    }

    return updated;
  }

  async changeLimit(roomId: string, userId: string, limit: number) {
    const roomExists = await this.prismaService.room.findUnique({
      where: { id: roomId },
    });

    if (!roomExists) {
      throw new NotFoundException('Room not found');
    }

    if (roomExists.owner !== userId) {
      throw new ForbiddenException('You are not the owner of this room');
    }

    const updated = await this.prismaService.room.update({
      where: {
        id: roomId,
      },
      data: {
        limit: limit,
      },
    });

    return updated;
  }
}
