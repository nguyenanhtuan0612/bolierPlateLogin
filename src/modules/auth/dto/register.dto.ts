import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    Length,
    Validate,
} from 'class-validator';
import { PasswordConfirmValidator } from 'src/validators/password-confirm.validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    firstName: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    lastName: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    fullName: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    phone: string;

    @ApiProperty()
    @IsNotEmpty()
    @Length(6, 24)
    @IsString()
    password: string;

    @ApiProperty()
    @Validate(PasswordConfirmValidator, ['password'])
    confirm_password: string;
}
