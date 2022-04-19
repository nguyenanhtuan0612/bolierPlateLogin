import { User } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
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
    active: boolean;

    @ApiProperty()
    googleId: string;

    @ApiProperty()
    facebookId: string;

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
    phone: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    constructor(user: User) {
        this.id = user.id;
        this.email = user.email;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.fullName = user.fullName;
        this.googleId = user.googleId;
        this.facebookId = user.facebookId;
        this.gender = user.gender;
        this.active = user.active;
        this.avatarImage = user.avatarImage;
        this.backgroundImage = user.backgroundImage;
        this.role = user.role;
        this.birthday = user.birthday;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
        this.phone = user.phone;
    }
}
