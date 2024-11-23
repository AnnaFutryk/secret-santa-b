import { IsNotEmpty, IsString } from 'class-validator';

export class JoinRoomDto {
    @IsNotEmpty()
  @IsString()
  link: string; 
}
