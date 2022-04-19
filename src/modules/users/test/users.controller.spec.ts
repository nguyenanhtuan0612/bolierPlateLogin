import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { PostgreSqlModule } from 'src/database/postgresql.db.module';
import { OutputHelper } from 'src/helpers/outputHelper';
import { Query } from 'src/middleware/query';
import { ActivitiesService } from 'src/modules/activities/services/activities.service';
import { UsersController } from '../controllers/users.controller';
import { Follow } from '../entities/follow.entity';
import { FriendRequest } from '../entities/friendRequest.entity';
import { Relationship } from '../entities/relationship.entity';
import { User } from '../entities/user.entity';
import { UsersService } from '../services/users.service';

describe('UsersController', () => {
    let controller: UsersController;

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

        controller = module.get<UsersController>(UsersController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
