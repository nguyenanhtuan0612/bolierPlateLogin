import {
    Controller,
    Get,
    Patch,
    Post,
    UseGuards,
    Body,
    Param,
    Req,
    HttpStatus,
    Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { FacebookAuth } from '../../guards/facebook.guard';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { OutputHelper } from 'src/helpers/outputHelper';
import { User } from '../users/entities/user.entity';
import { AuthUser } from 'src/decorators/auth.decorator';
import { ApiBearerAuth, ApiHeaders, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { GoogleAuth } from 'src/guards/google.guard';
import { PartitionGuard } from 'src/guards/partition.guard';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import errors from 'src/constants/errors';

@ApiTags('AUTHORIZATION')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly output: OutputHelper,
    ) {}

    @ApiBearerAuth('authorization')
    @UseGuards(JwtAuthGuard)
    @Get('jwt')
    async decode(@AuthUser() auth: User, @Res() res: any) {
        try {
            const rs = await this.decodeToken(auth);
            return res.status(200).json(this.output.formatOutputData(rs));
        } catch (error) {
            return res.status(400).json(this.output.displayErrorMessage(error));
        }
    }

    async decodeToken(auth: User) {
        if (!auth.id) {
            throw errors.TOKEN_INVALID;
        }
        return auth;
    }

    @Post()
    async login(@Res() res: any, @Body() loginDto: LoginDto) {
        try {
            const user = await this.authService.validateUser(loginDto);
            if (user) {
                const rs = await this.authService.generateJwtToken(user);
                return res.status(200).json(this.output.formatOutputData(rs));
            }
            throw errors.USERNAME_OR_PASSWORD_WRONG;
        } catch (error) {
            return res.status(400).json(this.output.displayErrorMessage(error));
        }
    }

    // === REGISTER USER  ===
    @Post('/register')
    async create(@Res() res: any, @Body() registerDto: RegisterDto) {
        try {
            const rs = await this.authService.register(registerDto);
            return res.status(200).json(this.output.formatOutputData(rs));
        } catch (error) {
            return res.status(400).json(this.output.displayErrorMessage(error));
        }
    }

    @Post('/refreshToken')
    async refreshToken(@Res() res: any, @Body() body: any) {
        try {
            const rs = this.authService.refreshToken(body);
            return res.status(200).json(this.output.formatOutputData(rs));
        } catch (error) {
            return res.status(400).json(this.output.displayErrorMessage(error));
        }
    }

    @Patch('/changePassword/:id')
    async changeYourPass(
        @Res() res: any,
        @Param('id') id: string,
        @Body() changePasswordDto: ChangePasswordDto,
    ) {
        try {
            const rs = await this.authService.updatePassword(
                id,
                changePasswordDto,
            );
            return res.status(200).json(this.output.formatOutputData(rs));
        } catch (error) {
            return res.status(400).json(this.output.displayErrorMessage(error));
        }
    }

    @ApiHeaders([{ name: 'partition' }])
    @UseGuards(PartitionGuard)
    @Post('/forgotPassword')
    async forgot(
        @Res() res: any,
        @Req() req: any,
        @Body() body: ForgotPasswordDto,
    ) {
        try {
            const { partition } = req;
            const rs = await this.authService.forgotPassword(
                partition.code,
                body,
            );
            return res.status(200).json(this.output.formatOutputData(rs));
        } catch (error) {
            return res.status(400).json(this.output.displayErrorMessage(error));
        }
    }

    @Post('/resetPassword')
    async resetPassword(
        @Res() res: any,
        @Body() resetPasswordDto: ResetPasswordDto,
    ) {
        try {
            const rs = await this.authService.resetPassword(resetPasswordDto);
            return res.status(200).json(this.output.formatOutputData(rs));
        } catch (error) {
            return res.status(400).json(this.output.displayErrorMessage(error));
        }
    }

    // === GOOGLE AUTHENTICATION ===
    @Get('/google')
    @UseGuards(GoogleAuth)
    async googleAuth() {
        return HttpStatus.OK;
    }

    @Get('/googleRedirect')
    @UseGuards(GoogleAuth)
    async googleAuthRedirect(@Res() res: any, @Req() req: any) {
        try {
            const user = await this.authService.googleLogin(req);
            const rs = await this.authService.generateJwtToken(user);
            return res.status(200).json(rs);
        } catch (error) {
            return res.status(400).json(this.output.displayErrorMessage(error));
        }
    }

    // === FACEBOOK AUTHENTICATION ===
    @Get('/facebook')
    @UseGuards(FacebookAuth)
    async facebookLogin(): Promise<any> {
        return HttpStatus.OK;
    }

    @Get('/facebook/redirect')
    @UseGuards(FacebookAuth)
    async facebookLoginRedirect(@Res() res: any, @Req() req: any) {
        try {
            const user = await this.authService.facebookLogin(req);
            const rs = await this.authService.generateJwtToken(user);
            return res.status(200).json(rs);
        } catch (error) {
            return res.status(400).json(this.output.displayErrorMessage(error));
        }
    }
}
