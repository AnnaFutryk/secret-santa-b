import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthResponse, TokensResponse } from 'types';
import { AuthService } from './auth.service';
import {
  RefreshTokenDto,
  SignInDto,
  SignUpDto,
} from './dtos';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @ApiResponse({
    status: 201,
    description: 'The user has been created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request, user already exists or validation errors',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error, please try again later',
  })
  async signUp(@Body() data: SignUpDto): Promise<AuthResponse> {
    return await this.authService.signUp(data);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  @ApiResponse({
    status: 200,
    description: 'The user has been logged successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request, invalid credentials',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error, please try again later',
  })
  async signIn(@Body() data: SignInDto): Promise<AuthResponse> {
    return await this.authService.signIn(data);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @ApiResponse({
    status: 200,
    description: 'The auth were refreshed successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized, invalid or expired token',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error, please try again later',
  })
  async refresh(@Body() data: RefreshTokenDto): Promise<TokensResponse> {
    return await this.authService.refresh(data.refreshToken);
  }


}
