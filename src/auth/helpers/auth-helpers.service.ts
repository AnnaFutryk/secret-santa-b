import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { TokensResponse } from '../../../types/tokens-response.type';

@Injectable()
export class AuthHelpersService {
  constructor(
    private readonly jwtService: JwtService,
  ) {}

  generateTokens(id: string): TokensResponse {
    const accessToken = this.jwtService.sign({ id }, { expiresIn: '30m' });
    const refreshToken = this.jwtService.sign({ id }, { expiresIn: '5d' });
    return {
      accessToken,
      refreshToken,
      accessTokenValidUntil: new Date(
        new Date().setMinutes(new Date().getMinutes() + 30),
      ),
      refreshTokenValidUntil: new Date(
        new Date().setDate(new Date().getDate() + 5),
      ),
    };
  }
}
