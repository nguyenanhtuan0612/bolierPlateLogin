import {
    CACHE_MANAGER,
    Inject,
    Injectable,
    NestMiddleware,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/services/users.service';

@Injectable()
export class Token implements NestMiddleware {
    constructor(
        @Inject(CACHE_MANAGER)
        private readonly cache: Cache,
        private readonly jwtService: JwtService,
        private readonly userSrv: UsersService,
    ) {}
    async use(req: any, res: any, next: () => void) {
        const authorization = req.headers.authorization;
        if (
            authorization &&
            authorization.split(' ')[0] &&
            authorization.split(' ')[0] === 'Bearer'
        ) {
            req.token = authorization.split(' ')[1];
        }

        if (req.token) {
            try {
                const tokenDecode: any = this.jwtService.decode(req.token);
                const userKey = tokenDecode.sub;
                const cached: any = await this.cache.get(userKey);
                console.log(tokenDecode);

                if (!cached || (cached && !cached.id)) {
                    console.log('get new user !');
                    req.auth = await this.userSrv.detail(userKey);
                    await this.cache.set(userKey, req.auth);

                    console.log(`user ${userKey} cached !!!`);
                } else {
                    req.auth = cached;
                    console.log('get cached user !!');
                }
            } catch (error) {
                req.auth = null;
            }

            if (req.auth) {
                switch (req.method) {
                    case 'POST':
                        Object.assign(req.body, {
                            createdBy: req.auth.id,
                            updatedBy: req.auth.id,
                        });
                        break;
                    case 'PUT':
                        Object.assign(req.body, {
                            updatedBy: req.auth.id,
                        });
                        break;
                }
            }
        }

        next();
    }
}
