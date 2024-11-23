import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteRoomDto {
  @ApiProperty({
    description: 'The ID of the room to delete.',
    example: '09160b1e-65c5-4aab-88be-2bad141c9a6b',
  })
  @IsString()
  @IsNotEmpty()
  roomId: string;
}
