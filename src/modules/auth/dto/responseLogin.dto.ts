import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseTokenDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    fullName: string;

    @ApiProperty()
    gender: string;

    @ApiProperty()
    avatarImage: string;

    @ApiProperty()
    backgroundImage: string;

    @ApiProperty()
    role: string;

    @ApiProperty()
    birthday: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    JWT: any;

    constructor(user: User, JWT: any) {
        this.id = user.id;
        this.email = user.email;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.fullName = user.fullName;
        this.gender = user.gender;
        this.avatarImage = user.avatarImage;
        this.backgroundImage = user.backgroundImage;
        this.role = user.role;
        this.birthday = user.birthday;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
        this.JWT = JWT;
    }
}
