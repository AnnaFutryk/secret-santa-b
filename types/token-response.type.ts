import { ApiProperty } from '@nestjs/swagger';

export class TokenResponse {
  @ApiProperty()
  sessionToken: string;

  @ApiProperty()
  sessionTokenValidUntil: number;
}
