import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { PrismaService } from 'libs/common';
import { AuthResponse, TokensResponse } from 'types';
import { omitPassword } from 'utils/omitPassword';
import { SignInDto, SignUpDto } from './dtos';
import { AuthHelpersService } from './helpers/auth-helpers.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly authHelpers: AuthHelpersService,
  ) {}

  async signUp(data: SignUpDto): Promise<AuthResponse> {
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

    const tokens = this.authHelpers.generateTokens(newUser.id);
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
        "The Email or Password is Wrong, or User doesn't Exist",
      );
    }

    const verifiedPassword = await compare(data.password, user.password);

    if (!verifiedPassword) {
      throw new UnauthorizedException(
        "The Email or Password is Wrong, or User doesn't Exist",
      );
    }

    const tokens = this.authHelpers.generateTokens(user.id);
    const userWithoutPassword = omitPassword(user);

    return {
      user: {
        ...userWithoutPassword,
      },
      ...tokens,
    };
  }

  async refresh(refreshToken: string): Promise<TokensResponse> {
    const verified = this.jwtService.verify(refreshToken);

    if (!verified) {
      throw new UnauthorizedException(
        'The Token is Invalid or Expired, Please Sign-In',
      );
    }

    return this.authHelpers.generateTokens(verified.sub);
  }
}
