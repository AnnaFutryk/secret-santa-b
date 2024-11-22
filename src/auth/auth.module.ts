import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from 'libs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthHelpersService } from './helpers/auth-helpers.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthHelpersService],
  exports: [AuthService],
})
export class AuthModule {}
