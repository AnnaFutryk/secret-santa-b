import { Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "libs/common";
import { UserEventDto } from "./dto/user-event.dto";

@Injectable()
export class SocketService {
  constructor(private readonly prismaService: PrismaService, private readonly jwt: JwtService) {}

  async createOrUpdateWish(roomId: string, userUserEventDto: UserEventDto, token: string) {
    const decodedToken = this.jwt.verify(token); 
    const userId = decodedToken.id as string; 
    const roomExists = await this.prismaService.room.findUnique({
      where: { id: roomId },
    });
    if (!roomExists) {
      throw new NotFoundException("Room тot found");
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

  async createOrUpdateAddress(roomId: string, userUserEventDto: UserEventDto, token: string) {
    const decodedToken = this.jwt.verify(token); 
    const userId = decodedToken.id; 
    const roomExists = await this.prismaService.room.findUnique({
      where: { id: roomId },
    });
    if (!roomExists) {
      throw new NotFoundException("Room тot found");
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
}
