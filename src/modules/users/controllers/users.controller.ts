import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Req,
    UseGuards,
    Res,
    ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/createUsers.dto';
import { UpdateUserDto } from '../dto/updateUser.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { OutputHelper } from 'src/helpers/outputHelper';
import { omit } from 'lodash';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { SetTargerDto } from '../dto/setTarget.dto';
import { AuthUser } from 'src/decorators/auth.decorator';
import { User } from '../entities/user.entity';

@ApiTags('USERS')
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly output: OutputHelper,
    ) {}

    @ApiBearerAuth('authorization')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(['admin'])
    @Get('export')
    async export(@Req() req: any, @Res() res: any) {
        try {
            let { options } = req;
            options = omit(options, ['subQuery', 'limit', 'offset']);
            const rs = await this.usersService.list(options);
            return res.status(200).json(this.output.formatOutputData(rs));
        } catch (error) {
            console.log(error);
            return res.status(400).json(this.output.displayErrorMessage(error));
        }
    }

    @ApiBearerAuth('authorization')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(['admin'])
    @Post()
    async create(@Body() createUserDto: CreateUserDto, @Res() res: any) {
        try {
            const rs = await this.usersService.create(createUserDto);
            return res.status(200).json(this.output.formatOutputData(rs));
        } catch (error) {
            return res.status(400).json(this.output.displayErrorMessage(error));
        }
    }

    @ApiBearerAuth('authorization')
    @ApiQuery({
        name: 'filter',
        description:
            '[{"operator":"search","value":"provai","property":"email,fullName"},{"operator":"eq","value":"887c1870-3000-4110-9426-89afa8724d69","property":"id"}]',
        required: false,
    })
    @ApiQuery({
        name: 'sort',
        description: '[{"direction":"DESC","property":"createdAt"}]',
        required: false,
    })
    @ApiQuery({
        name: 'start',
        description: '0',
        required: false,
    })
    @ApiQuery({
        name: 'limit',
        description: '10',
        required: false,
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(['admin'])
    @Get()
    async list(@Req() req: any, @Res() res: any) {
        try {
            const { options } = req;
            const rs = await this.usersService.list(options);
            return res.status(200).json(this.output.formatOutputData(rs));
        } catch (error) {
            return res.status(400).json(this.output.displayErrorMessage(error));
        }
    }

    @Patch('/:id')
    async update(
        @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
        @Body() updateUserDto: UpdateUserDto,
        @Res() res: any,
    ) {
        try {
            const rs = await this.usersService.update(id, updateUserDto);
            return res.status(200).json(this.output.formatOutputData(rs));
        } catch (error) {
            return res.status(400).json(this.output.displayErrorMessage(error));
        }
    }

    @Get('/:id')
    async detail(
        @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
        @Res() res: any,
    ) {
        try {
            const rs = await this.usersService.detail(id);
            return res.status(200).json(this.output.formatOutputData(rs));
        } catch (error) {
            return res.status(400).json(this.output.displayErrorMessage(error));
        }
    }

    @ApiBearerAuth('authorization')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(['admin'])
    @Delete('/:id')
    async remove(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Res() res: any,
    ) {
        try {
            const rs = await this.usersService.remove(id);
            return res.status(200).json(this.output.formatOutputData(rs));
        } catch (error) {
            return res.status(400).json(this.output.displayErrorMessage(error));
        }
    }

    @ApiBearerAuth('authorization')
    @UseGuards(JwtAuthGuard)
    @Post('target')
    async setTarget(
        @Res() res: any,
        @Body() body: SetTargerDto,
        @AuthUser() auth: User,
    ) {
        try {
            const rs = await this.usersService.setTarget(auth.id, body.target);
            return res.status(200).json(this.output.formatOutputData(rs));
        } catch (error) {
            return res.status(400).json(this.output.displayErrorMessage(error));
        }
    }
}
