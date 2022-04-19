import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import _ from 'lodash';
import errors from 'src/constants/errors';

@Injectable()
export class TokenGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const permission = this.reflector.get<string[]>(
            'permissions',
            context.getHandler(),
        );
        const request = context.switchToHttp().getRequest();
        const auth = request.auth;
        if (!auth) {
            throw new UnauthorizedException();
        }
        if (!permission) {
            return true;
        }
        const { rolePermissions } = auth;
        if (rolePermissions) {
            const { permissions } = rolePermissions;
            if (!_.find(permissions, { name: permission })) {
                throw new UnauthorizedException(errors.ACCESS_DENIED.message);
            }
        }
        return true;
    }
}
