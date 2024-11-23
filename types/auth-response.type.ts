import { ApiProperty } from "@nestjs/swagger";
import { TokensResponse } from "./tokens-response.type";
import { User } from "./user.type";

export class AuthResponse extends TokensResponse {
  @ApiProperty()
  user: Omit<User, 'password'>;
}