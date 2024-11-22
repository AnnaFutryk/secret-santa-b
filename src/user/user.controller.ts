import {
  Controller,
  Get,
  NotFoundException,
  Req
} from '@nestjs/common';
import { Request } from 'express';
import { Auth } from 'libs/entities/decorators';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Auth()
  async getMe(@Req() req: Request & {user: string}) {

    if (!req.user) {
      throw new NotFoundException("The user with that credential wasn't found")
    }

    return await this.userService.getMe(req.user);
  }



}
