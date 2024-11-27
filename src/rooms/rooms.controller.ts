import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'libs/entities/decorators';
import { UserRequest } from 'types/user-request';
import { CreateRoomDto } from './dto/create.dto';
import { DeleteRoomDto } from './dto/delete.dto';
import { RoomsGateway } from './rooms.gateway';
import { RoomsService } from './rooms.service';

@ApiTags('Room endpoints')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomService: RoomsService,  private readonly roomsGateway: RoomsGateway) {}

  @ApiOperation({ summary: 'Get rooms I am a member of' })
  @ApiResponse({ status: 200, description: 'List of rooms retrieved successfully.' })
  @ApiResponse({
    status: 404,
    description: 'Rooms not found for the user.',
  })
  @Auth()
  @Get()
  async getUserRooms(@Req() req: UserRequest) {
    return this.roomService.getUserRooms(req.user);
  }


  @ApiOperation({ summary: 'Create a room' })
  @ApiResponse({ status: 201, description: 'Room created successfully.' })
  @ApiResponse({
    status: 409,
    description: 'The room with that title already exists for this user.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid room data (e.g., missing or invalid title/limit).',
  })
  @Auth()
  @Post()
  async createRoom(@Req() req: UserRequest, @Body() data: CreateRoomDto) {
    return this.roomService.createRoom({ data, id: req.user });
  }

  @ApiOperation({ summary: 'Delete a room' })
  @ApiResponse({ status: 200, description: 'Room deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Room not found.' })
  @Auth()
  @Delete(':roomId')
  async deleteRoom(@Param() { roomId }: DeleteRoomDto) {
    return this.roomService.deleteRoom(roomId);
  }
}
