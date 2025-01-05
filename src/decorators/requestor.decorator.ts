import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Requestor = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export interface Requestor {
  id: string;
  email: string;
  role: string;
  businessId: string;
}
