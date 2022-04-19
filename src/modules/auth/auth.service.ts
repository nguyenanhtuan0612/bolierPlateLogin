import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/services/users.service';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ResponseTokenDto } from './dto/responseLogin.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserDto } from '../users/dto/responeUsers.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import * as bcrypt from 'bcrypt';
import { OtpHelper } from 'src/helpers/otpHelper';
import { partitionCode } from 'src/constants/partitions';
import { fromEmail, subjectEmail, typeEmail } from 'src/constants/mail';
import rmqConfigs from 'src/configs/rmq.configs';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { UserOTP } from '../users/entities/userOtp.entity';
import errors from 'src/constants/errors';
import success from 'src/constants/success';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly otpHelper: OtpHelper,
        @Inject(rmqConfigs().clientList.mail)
        private mailClient: ClientProxy,
    ) {}

    async validateUser(loginDto: LoginDto) {
        const user = await this.userService.findByEmail(loginDto.email);
        if (user) {
            const compareResult = await bcrypt.compare(
                loginDto.password,
                user.password,
            );
            if (compareResult) return user;
        }
    }

    async generateJwtToken(user: any) {
        const payload = {
            googleId: user.googleId,
            facebookId: user.facebookId,
            email: user.email,
            sub: user.id,
        };
        const tokenExpiresIn = this.configService.get<string>('jwtExpiresIn');
        const accessToken = await this.jwtService.signAsync(payload, {
            expiresIn: tokenExpiresIn,
        });

        const refreshTokenExpiresIn = this.configService.get<string>(
            'jwtRefreshExpiresIn',
        );

        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('jwtRefreshTokenKey'),
            expiresIn: refreshTokenExpiresIn,
        });

        const result = new ResponseTokenDto(user, {
            accessToken,
            refreshToken,
            tokenExpiresIn,
            refreshTokenExpiresIn,
        });
        return result;
    }

    async refreshToken(body: any) {
        return new Promise<any>(async (resolve, reject) => {
            try {
                const { refreshToken } = body;
                if (body) {
                    const refreshTokenKey =
                        this.configService.get<string>('jwtRefreshTokenKey');
                    const decoded = await this.jwtService.verifyAsync(
                        refreshToken,
                        {
                            secret: refreshTokenKey,
                        },
                    );
                    if (decoded.error) {
                        throw new BadRequestException(decoded.message);
                    }
                }
            } catch (error) {
                return reject(error);
            }
        });
    }

    async forgotPassword(partition: string, forgotPassword: ForgotPasswordDto) {
        return new Promise<any>(async (resolve, reject) => {
            try {
                const subject = subjectEmail.SEND_OTP;
                let from: any = {};
                switch (partition) {
                    case partitionCode.TOEICAZ: {
                        from = fromEmail.TOEICAZ;
                        break;
                    }
                }
                const otp = this.otpHelper.generateOTP(6);
                const user = await User.findOne({
                    where: { email: forgotPassword.email },
                });
                if (!user) {
                    return reject('user not found');
                }

                const userOtp = await UserOTP.findOne({
                    where: { userId: user.id },
                });
                if (userOtp) {
                    await userOtp.update({ otp });
                } else {
                    const newUserOtp = new UserOTP();
                    await newUserOtp.update({
                        userId: user.id,
                        otp,
                    });
                }
                const data = await lastValueFrom(
                    this.mailClient.send(
                        { mod: 'mail', act: 'send' },
                        {
                            data: {
                                otp,
                                from,
                            },
                            type: typeEmail.SEND_OTP,
                            params: {
                                to: forgotPassword.email,
                                subject,
                            },
                        },
                    ),
                );
                return resolve(data);
            } catch (error) {
                return reject(error);
            }
        });
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        new Promise(async (resolve, reject) => {
            try {
                const user = await User.findOne({
                    where: { email: resetPasswordDto.email },
                });
                if (!user) {
                    return reject('user not found');
                }

                const checkOTP = await UserOTP.findOne({
                    where: {
                        userId: user.id,
                    },
                });

                if (checkOTP) {
                    const otpTime = new Date(checkOTP.createdAt);
                    otpTime.setMinutes(otpTime.getMinutes() + 5);
                    const currentTime = new Date();
                    if (resetPasswordDto.OTP !== checkOTP.otp) {
                        return reject('{{otp.validation.otpIsNotValid}}');
                    }
                    if (otpTime < currentTime) {
                        return reject('{{otp.validation.otpIsExpired}}');
                    }
                } else {
                    return reject('{{otp.validation.otpIsNotFound}}');
                }

                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(
                    resetPasswordDto.newPassword,
                    salt,
                );
                await user.save();
                return resolve(user);
            } catch (error) {
                return reject(error);
            }
        });
    }

    async googleLogin(req) {
        return this.userService.googleFindOrCreate(req.user);
    }

    async facebookLogin(req) {
        return await this.userService.facebookFindOrCreate(req.user);
    }

    async updatePassword(id: string, changePasswordDto: ChangePasswordDto) {
        const user = await User.findByPk<User>(id);
        if (!user) {
            throw errors.USER_NOT_FOUND;
        }

        if (user.googleId || user.facebookId)
            throw errors.CAN_NOT_CHANGE_PASSWORD;
        const compareResult = await bcrypt.compare(
            changePasswordDto.oldPassword,
            user.password,
        );

        if (compareResult) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(
                changePasswordDto.newPassword,
                salt,
            );
            await user.save();
            return {
                message: success.PASSWORD_CHANGE,
            };
        }
        throw errors.WRONG_OLD_PASSWORD;
    }

    async register(registerDto: RegisterDto) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = new User();
                user.email = registerDto.email;
                user.role = 'user';
                user.firstName = registerDto.firstName;
                user.lastName = registerDto.lastName;
                user.fullName = registerDto.fullName
                    ? registerDto.fullName
                    : `${user.firstName} ${user.lastName}`;

                user.phone = registerDto.phone;

                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(registerDto.password, salt);
                const userData = await user.save();

                return resolve(new UserDto(userData));
            } catch (error) {
                reject(error);
            }
        });
    }
}
