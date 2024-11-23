import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class WishDto {
  @ApiProperty({ example: 'I wish for a new laptop' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
