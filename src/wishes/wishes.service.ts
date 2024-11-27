import { Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "libs/common";
import { WishDto } from "./dto/wish.dto";

@Injectable()
export class WishesService {
  constructor(private readonly prismaService: PrismaService, private readonly jwt: JwtService) {}

  async createOrUpdateWish(roomId: string, wishDto: WishDto, token: string) {
    const decodedToken = this.jwt.verify(token); // verify перевіряє токен і декодує його
    const userId = decodedToken.id; // отримуємо userId
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
