import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'libs/entities/decorators';
import { UserRequest } from 'types/user-request';
import { WishDto } from './dto/wish.dto';
import { WishesService } from './wishes.service';

@Controller('wishes')
@ApiTags('Wishes endpoints')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @ApiOperation({ summary: 'Create or update a wish for a specific room' })
  @ApiResponse({
    status: 201,
    description: 'Wish has been created or updated successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Room not found.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request, invalid input.',
  })
  @ApiParam({ name: 'roomId', description: 'The ID of the room where the wish is created or updated' })
  @ApiBody({ type: WishDto, description: 'The wish data' })
  @Auth()
  @Post(':roomId')
  async createWish(
    @Param('roomId') roomId: string,
    @Body() wishDto: WishDto,
    @Req() req: UserRequest,
  ) {
    return this.wishesService.createOrUpdateWish(roomId, wishDto, req.user);
  }
  
}
