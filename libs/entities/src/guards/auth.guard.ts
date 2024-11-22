import { Injectable } from '@nestjs/common/decorators';
import { NotFoundException, UnauthorizedException } from '@nestjs/common/exceptions';
import { CanActivate, ExecutionContext } from '@nestjs/common/interfaces';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService, PrismaService } from 'libs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException("The Token isn't provided");
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.config.get('JWT_SECRET') as string,
      });

      const userExist = await this.prisma.user.findUnique({where: {id: payload.id}})

      if (!userExist) {
        throw new NotFoundException("The user with that credential wasn't found")
      }

      request['user'] = payload.id;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('The Token is Expired, Please Sign-In');
      } else {
        throw new UnauthorizedException('The Token is Invalid, Please Sign-In');
      }
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
