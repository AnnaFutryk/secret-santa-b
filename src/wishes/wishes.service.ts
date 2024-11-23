import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "libs/common";
import { WishDto } from "./dto/wish.dto";

@Injectable()
export class WishesService {
  constructor(private readonly prismaService: PrismaService) {}

  async createOrUpdateWish(roomId: string, wishDto: WishDto, userId: string) {
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
          content: wishDto.content,
        },
      });
    }

    return this.prismaService.wish.create({
      data: {
        content: wishDto.content,
        userId: userId,
        roomId: roomId,
      },
    });
  }
}
