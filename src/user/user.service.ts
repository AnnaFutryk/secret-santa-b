import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'libs/common';
import { User } from 'types';
import { omitPassword } from 'utils/omitPassword';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService){}

  async getMe(id: string): Promise<Omit<User, "password">> {

    const user = await this.prisma.user.findUnique({where: { id }})

    if (!user) {
      throw new NotFoundException("User with that credentials wasn't found")
    }
    
    return omitPassword(user)
  }

}
