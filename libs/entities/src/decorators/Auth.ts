import { applyDecorators, UseGuards } from '@nestjs/common/decorators/core';
import { AuthGuard } from '../guards/auth.guard';

export const Auth = () => {
  return applyDecorators(UseGuards(AuthGuard));
};
