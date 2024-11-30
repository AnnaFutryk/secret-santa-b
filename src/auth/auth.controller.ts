import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthResponse } from 'types';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dtos';

@Controller('auth')
@ApiTags('Auth endpoints')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @ApiResponse({
    status: 201,
    description: 'The user has been created successfully.',
    type: AuthResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request: Validation errors or user already exists.',
    schema: {
      example: {
        statusCode: 400,
        message: 'The email provided is already in use.',
        error: 'BadRequest',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict: User already exists.',
    schema: {
      example: {
        statusCode: 409,
        message: 'The User is Already Been Registered, Please Sign-In',
        error: 'Conflict',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error. Please try again later.',
  })
  @ApiOperation({ summary: 'Register User' })
  async signUp(@Body() data: SignUpDto): Promise<AuthResponse> {
    return await this.authService.signUp(data);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  @ApiResponse({
    status: 200,
    description: 'The user has been logged in successfully.',
    type: AuthResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request: Invalid credentials (wrong email/password).',
    schema: {
      example: {
        statusCode: 400,
        message: 'The email or password is incorrect.',
        error: 'BadRequest',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized: Incorrect or missing credentials.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid email or password.',
        error: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error. Please try again later.',
  })
  @ApiOperation({ summary: 'Authorize User' })
  async signIn(@Body() data: SignInDto): Promise<AuthResponse> {
    return await this.authService.signIn(data);
  }
}
