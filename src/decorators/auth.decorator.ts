import {
    createParamDecorator,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';

export const AuthUser = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const { auth } = context.switchToHttp().getRequest();
        if (auth) {
            return auth;
        }
        throw new UnauthorizedException();
    },
);
