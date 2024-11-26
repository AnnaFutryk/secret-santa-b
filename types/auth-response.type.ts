import { ApiProperty } from "@nestjs/swagger";
import { TokenResponse } from "./token-response.type";
import { User } from "./user.type";

export class AuthResponse extends TokenResponse {
  @ApiProperty()
  user: Omit<User, 'password'>;
}