import { TokensResponse } from './tokens-response.type';
import { User } from './user.type';
export type AuthResponse = TokensResponse & {
  user: Omit<User, 'password'>;
};
