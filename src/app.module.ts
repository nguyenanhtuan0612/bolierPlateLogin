import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfigs from './configs/app.configs';
import rmqConfigs from './configs/rmq.configs';
import { SequelizeModule } from '@nestjs/sequelize';
import cacheConfigs from './configs/cache.configs';
import urlConfigs from './configs/url.configs';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import jwtConfigs from './configs/jwt.configs';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [
                appConfigs,
                rmqConfigs,
                cacheConfigs,
                urlConfigs,
                jwtConfigs,
            ],
        }),

        SequelizeModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async () => ({
                dialect: appConfigs().postgres.dialect,
                host: appConfigs().postgres.host,
                port: appConfigs().postgres.port,
                username: appConfigs().postgres.username,
                password: appConfigs().postgres.password,
                database: appConfigs().postgres.database,
                autoLoadModels: appConfigs().postgres.autoLoadModels,
                synchronize: appConfigs().postgres.synchronize,
                logging: appConfigs().postgres.logging,
                dialectOptions: {
                    timeout: 8000,
                },
                timezone: '+07:00',
                hooks: {
                    beforeCount: function (options: any) {
                        if (!this._scope.include) {
                            options.subQuery = false;
                        }
                        if (
                            this._scope.include &&
                            this._scope.include.length > 0
                        ) {
                            options.distinct = true;
                            options.col =
                                this._scope.col ||
                                options.col ||
                                `"${this.options.name.singular}".id`;
                        }
                        if (options.include && options.include.length > 0) {
                            options.include = null;
                        }
                    },
                },
            }),
        }),

        UsersModule,
        AuthModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
