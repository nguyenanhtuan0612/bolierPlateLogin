import { SendGridModule } from '@anchan828/nest-sendgrid';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import mailConfigs from 'src/configs/mail.configs';
import { PostgreSqlModule } from 'src/database/postgresql.db.module';
import { OtpHelper } from 'src/helpers/otpHelper';
import { OutputHelper } from 'src/helpers/outputHelper';
import { ActivitiesService } from 'src/modules/activities/services/activities.service';
import { Follow } from 'src/modules/users/entities/follow.entity';
import { FriendRequest } from 'src/modules/users/entities/friendRequest.entity';
import { Relationship } from 'src/modules/users/entities/relationship.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/services/users.service';
import { UsersModule } from 'src/modules/users/users.module';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { FacebookStrategy } from '../strategies/facebook.strategy';
import { GoogleStrategy } from '../strategies/google.strategy';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { LocalStrategy } from '../strategies/local.strategy';

describe('AuthController', () => {
    let controller: AuthController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                SequelizeModule.forFeature([
                    User,
                    Follow,
                    Relationship,
                    FriendRequest,
                ]),
                UsersModule,
                PassportModule,
                JwtModule.registerAsync({
                    imports: [ConfigModule],
                    useFactory: async (configService: ConfigService) => ({
                        secret: configService.get<string>('jwtSecretKey'),
                    }),
                    inject: [ConfigService],
                }),
                PostgreSqlModule,
                SendGridModule.forRoot({
                    apikey: mailConfigs().sendgridKey,
                }),
            ],
            providers: [
                AuthService,
                LocalStrategy,
                JwtStrategy,
                FacebookStrategy,
                GoogleStrategy,
                OutputHelper,
                OtpHelper,
                ActivitiesService,
                UsersService,
                ConfigService,
            ],
            controllers: [AuthController],
        }).compile();

        controller = module.get<AuthController>(AuthController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
