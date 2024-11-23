import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Auth } from 'libs/entities/decorators';
import { UserRequest } from 'types/user-request';
import { WishDto } from './dto/wish.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Create a wish' })
  @Auth()
  @Post('wishes/:roomId')
  async createWish(
    @Param('roomId') roomId: string,
    @Body() wishDto: WishDto,
    @Req() req: UserRequest,
  ) {
    return this.userService.createOrUpdateWish(roomId, wishDto, req.user);
  }
}
