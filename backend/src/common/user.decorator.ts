import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: keyof any | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    // Nếu truyền @User('userId') sẽ trả về user.userId, còn @User() trả về toàn bộ user
    return data ? user?.[data] : user;
  },
); 