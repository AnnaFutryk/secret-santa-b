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
      ),
    };
  }

  async signUp(data: SignUpDto): Promise<AuthResponse> {
    console.log(data);
    try {
      const isUserExists = await this.prismaService.user.findUnique({
        where: { email: data.email },
      });

      if (isUserExists) {
        throw new ConflictException(
          'The User is Already Been Registered, Please Sign-In',
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
    } catch (error) {
      console.log(error);
    }
  }

  async signIn(data: SignInDto): Promise<AuthResponse> {
    const user = await this.prismaService.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new BadRequestException(
        "The Email or Password is Wrong, or User doesn't Exist",
      );
    }

    const verifiedPassword = await compare(data.password, user.password);

    if (!verifiedPassword) {
      throw new UnauthorizedException(
        "The Email or Password is Wrong, or User doesn't Exist",
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
