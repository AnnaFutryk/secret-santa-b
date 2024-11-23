import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Auth } from 'libs/entities/decorators';
import { UserRequest } from 'types/user-request';
import { CreateRoomDto } from './dto/create.dto';
import { DeleteRoomDto } from './dto/delete.dto';
import { JoinRoomDto } from './dto/join.dto';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @ApiOperation({ summary: 'Get rooms I am a member of' })
  @ApiResponse({ status: 200, description: 'List of rooms retrieved successfully.' })
  @Auth()
  @Get()
  async getUserRooms(@Req() req: UserRequest) {
    return this.roomService.getUserRooms(req.user);
  }

  @ApiOperation({ summary: 'Get a specific room by ID' })
  @ApiResponse({ status: 200, description: 'Room found successfully.' })
  @ApiResponse({ status: 404, description: 'Room not found.' })
  @Auth()
  @Get(':roomId')
  async getRoomById(@Param('roomId') roomId: string) {
    const room = await this.roomService.getRoomById(roomId);
    if (!room) {
      throw new NotFoundException('Room with the specified ID not found.');
    }
    return room;
  }

  @ApiOperation({ summary: 'Join a room' })
  @ApiResponse({ status: 200, description: 'User successfully joined the room.' })
  @Auth()
  @Post('join')
  async joinRoom(@Req() req: UserRequest, @Body() joinRoomDto: JoinRoomDto) {
    return this.roomService.joinRoom(joinRoomDto.id, req.user);
  }

  @ApiOperation({ summary: 'Create a room' })
  @ApiResponse({ status: 201, description: 'Room created successfully.' })
  @Auth()
  @Post()
  async createRoom(@Req() req: UserRequest, @Body() data: CreateRoomDto) {
    return this.roomService.createRoom({ data, id: req.user });
  }

  @ApiOperation({ summary: 'Delete a room' })
  @ApiResponse({ status: 200, description: 'Room deleted successfully.' })
  @Auth()
  @Delete()
  async deleteRoom(@Body() { id }: DeleteRoomDto) {
    return this.roomService.deleteRoom(id);
  }
}
