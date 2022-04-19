import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwtConfigs from 'src/configs/jwt.configs';
import errors from 'src/constants/errors';

import { UserDto } from 'src/modules/users/dto/responeUsers.dto';
import { User } from 'src/modules/users/entities/user.entity';

export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConfigs().jwtSecretKey,
        });
    }

    async validate(payload: any) {
        const user = await User.findByPk(payload.sub);
        if (!user) {
            throw errors.TOKEN_INVALID;
        }
        const data = new UserDto(user);
        return JSON.parse(JSON.stringify(data));
    }
}
