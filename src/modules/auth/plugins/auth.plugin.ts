import { Controller } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OutputHelper } from 'src/helpers/outputHelper';
import { UsersService } from '../../users/services/users.service';

@Controller('mailPlugin')
export class AuthPlugin {
    constructor(
        private readonly userSrv: UsersService,
        private readonly output: OutputHelper,
        private readonly jwt: JwtService,
    ) {}

    @MessagePattern({ mod: 'auth', act: 'token' })
    async send(@Payload() args: any) {
        try {
            const { token } = args;
            const tokenDecode: any = this.jwt.decode(token);
            const userKey = tokenDecode.sub;
            const rs = await this.userSrv.detail(userKey);
            return rs;
        } catch (error) {
            return this.output.formatOutputData(error);
        }
    }

    @MessagePattern({ mod: 'auth', act: 'updatePoint' })
    async updatePoint(@Payload() args: any) {
        try {
            const { userId, point } = args;
            const rs = await this.userSrv.updatePoint(userId, point);
            return rs;
        } catch (error) {
            return this.output.formatOutputData(error);
        }
    }
}
