import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { PrismaService } from 'libs/common';
import { AuthResponse, TokenResponse } from 'types';
import { omitPassword } from 'utils/omitPassword';
import { SignInDto, SignUpDto } from './dtos';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  private generateSessionToken(id: string): TokenResponse {
    const sessionToken = this.jwtService.sign({ id });
    return {
      sessionToken,
      sessionTokenValidUntil: new Date(
        new Date().setDate(new Date().getDate() + 5),
      ).getTime(),
    };
  }

  async signUp(data: SignUpDto): Promise<AuthResponse> {
    const isUserExists = await this.prismaService.user.findUnique({
      where: { email: data.email },
    });

    if (isUserExists) {
      throw new ConflictException(
        'Користувач вже існує, якщо це ви - спробуйте увійти',
      );
    }

    const hashedPassword = await hash(data.password, 10);

    const newUser = await this.prismaService.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    const tokens = this.generateSessionToken(newUser.id);
    const userWithoutPassword = omitPassword(newUser);

    return {
      user: {
        ...userWithoutPassword,
      },
      ...tokens,
    };
  }

  async signIn(data: SignInDto): Promise<AuthResponse> {
    const user = await this.prismaService.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new BadRequestException(
        'Пошта або пароль не вірні, спробуйте ще раз!',
      );
    }

    const verifiedPassword = await compare(data.password, user.password);
    console.log(verifiedPassword);
    if (!verifiedPassword) {
      throw new UnauthorizedException(
        'Пошта або пароль не вірні, спробуйте ще раз!',
      );
    }

    const tokens = this.generateSessionToken(user.id);
    const userWithoutPassword = omitPassword(user);

    return {
      user: {
        ...userWithoutPassword,
      },
      ...tokens,
    };
  }
}
