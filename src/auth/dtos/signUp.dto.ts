import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength
} from 'class-validator';

export class SignUpDto {
  @ApiProperty({ type: String, required: true, example: 'John' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ type: String, required: true, example: 'SecurePassword123!' })
  @IsNotEmpty()
  @MinLength(7)
  password: string;

}
