import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService, PrismaService } from 'libs/common';
import { CreateRoomDto } from './dto/create.dto';

@Injectable()
export class RoomsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
 
  ) {}

  async getUserRooms(userId: string) {
    return this.prisma.room.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
    });
  }

  async getRoomById(roomId: string) {
    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
      include: {
        users: {
          include: {
            wishes: {
              where: { roomId },
              select: {
                content: true,
              },
            },
            Address: {
              where: {roomId},
              select: {
                content: true
              }
            } 
          },
        },
      },
    });
  
    return {
      id: room.id,
      title: room.title,
      owner: room.owner,
      limit: room.limit,
      url: room.url,
      users: room.users.map(user => ({
        name: user.name,
        email: user.email,
        wishes: user.wishes.map(wish => ({
          content: wish.content,
        })),
        addresses: user.Address.map(address => ({
          content: address.content
        }))
      
      })),
    };
  }

  async createRoom({ data, id }: { data: CreateRoomDto; id: string }) {
    const existingRoomWithCurrentTitle = await this.prisma.room.findFirst({
      where: {
        owner: id, 
        title: data.title,
      },
    });

    if (existingRoomWithCurrentTitle) {
      throw new ConflictException("The room with that title already created, choose another title")
    }

    const room = await this.prisma.room.create({
      data: {
        title: data.title,
        limit: data.limit,
        owner: id,
        users: {
          connect: { id },
        },
      },
    });

    const url = await this.encryptLink(room.id);

    return this.prisma.room.update({
      where: { id: room.id },
      data: { url },
    });
  }

  async joinRoom(roomId: string, userId: string) {

    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
      include: { users: true },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    if (room.users.some(user => user.id === userId)) {
      throw new ConflictException('User is already in room');
    }
    
    return this.prisma.room.update({
      where: { id: roomId },
      data: {
        users: {
          connect: { id: userId },
        },
      },
    });
  }

  async deleteRoom(id: string) {
    const room = await this.prisma.room.findUnique({ where: { id } });
  
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    await this.prisma.wish.deleteMany({
      where: { roomId: id },
    });
  
    return this.prisma.room.delete({ where: { id } });
  }
  

  private async encryptLink(roomId: string): Promise<string> {
    const frontendLink = this.config.get('FRONT_END_URL');
    const hashedRoomId = await this.jwt.signAsync({ roomId });
    return `${frontendLink}?join=${hashedRoomId}`;
  }

  private async decryptId(hashedId: string): Promise<string> {
    const decoded = this.jwt.decode(hashedId);
    if (typeof decoded === 'object' && decoded?.roomId) {
      return decoded.roomId;
    } else {
      throw new Error('Invalid or expired token');
    }
  }
}
