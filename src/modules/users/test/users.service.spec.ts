import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { PostgreSqlModule } from 'src/database/postgresql.db.module';
import { OutputHelper } from 'src/helpers/outputHelper';
import { Query } from 'src/middleware/query';
import { ActivitiesService } from 'src/modules/activities/services/activities.service';
import { UsersService } from 'src/modules/users/services/users.service';
import { UsersController } from '../controllers/users.controller';
import { Follow } from '../entities/follow.entity';
import { FriendRequest } from '../entities/friendRequest.entity';
import { Relationship } from '../entities/relationship.entity';
import { User } from '../entities/user.entity';

describe('UsersService', () => {
    let service: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                SequelizeModule.forFeature([
                    User,
                    Follow,
                    Relationship,
                    FriendRequest,
                ]),
                PostgreSqlModule,
            ],
            controllers: [UsersController],
            providers: [UsersService, OutputHelper, Query, ActivitiesService],
        }).compile();

        service = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
