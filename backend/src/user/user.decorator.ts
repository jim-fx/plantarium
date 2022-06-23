import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role } from 'auth/enums/role.enum';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);


export type UserRaw = {
  sub: string;
  username: string;
  role: Role
}
