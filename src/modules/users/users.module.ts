import { Module, MiddlewareConsumer, CacheModule } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OutputHelper } from 'src/helpers/outputHelper';
import { Query } from 'src/middlewares/query';
import { User } from './entities/user.entity';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import rmqConfigs from 'src/configs/rmq.configs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OtpHelper } from 'src/helpers/otpHelper';
import { Token } from 'src/middlewares/token';
import cacheConfigs from 'src/configs/cache.configs';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Partition } from 'src/middlewares/partition';
import { AuthController } from '../auth/auth.controller';
import { UserOTP } from './entities/userOtp.entity';
import { UserTarger } from './entities/userTarget.entity';

@Module({
    imports: [
        SequelizeModule.forFeature([User, UserOTP, UserTarger]),
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
        CacheModule.registerAsync({
            useFactory: async () => ({
                store: redisStore,
                host: cacheConfigs().host,
                port: cacheConfigs().port,
            }),
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('jwtSecretKey'),
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [UsersController],
    providers: [UsersService, OutputHelper, OtpHelper, Query],
    exports: [UsersService],
})
export class UsersModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(Partition, Token, Query)
            .exclude()
            .forRoutes(UsersController);
        consumer
            .apply(Partition, Token, Query)
            .exclude()
            .forRoutes(AuthController);
    }
}
