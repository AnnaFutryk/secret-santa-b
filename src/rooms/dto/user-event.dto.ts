import { IsNotEmpty, IsString } from 'class-validator';

export class UserEventDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}
