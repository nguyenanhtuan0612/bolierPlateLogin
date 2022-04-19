import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { GoogleStrategy } from './strategies/google.strategy';
import { OutputHelper } from 'src/helpers/outputHelper';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../users/entities/user.entity';
import { OtpHelper } from 'src/helpers/otpHelper';
import { AuthPlugin } from './plugins/auth.plugin';
import { ClientsModule, Transport } from '@nestjs/microservices';
import rmqConfigs from 'src/configs/rmq.configs';
import { FacebookStrategy } from './strategies/facebook.strategy';

@Module({
    imports: [
        SequelizeModule.forFeature([User]),
        UsersModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('jwtSecretKey'),
            }),
            inject: [ConfigService],
        }),
        ClientsModule.registerAsync([
            {
                name: rmqConfigs().clientList.mail,
                useFactory: () => ({
                    transport: Transport.RMQ,
                    options: {
                        urls: [
                            `amqp://${rmqConfigs().username}:${
                                rmqConfigs().password
                            }@${rmqConfigs().url}`,
                        ],
                        queue: rmqConfigs().queueList.mail,
                        queueOptions: {
                            durable: true,
                        },
                    },
                }),
            },
            {
                name: rmqConfigs().clientList.partition,
                useFactory: () => ({
                    transport: Transport.RMQ,
                    options: {
                        urls: [
                            `amqp://${rmqConfigs().username}:${
                                rmqConfigs().password
                            }@${rmqConfigs().url}`,
                        ],
                        queue: rmqConfigs().queueList.partition,
                        queueOptions: {
                            durable: true,
                        },
                    },
                }),
            },
        ]),
    ],
    providers: [
        AuthService,
        JwtStrategy,
        FacebookStrategy,
        GoogleStrategy,
        OutputHelper,
        OtpHelper,
    ],
    controllers: [AuthController, AuthPlugin],
})
export class AuthModule {}
