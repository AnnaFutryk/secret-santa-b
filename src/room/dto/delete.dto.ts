import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteRoomDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
