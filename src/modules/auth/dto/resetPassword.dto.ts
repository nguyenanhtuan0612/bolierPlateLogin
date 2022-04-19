import { ApiProperty } from '@nestjs/swagger';
import { PasswordConfirmValidator } from 'src/validators/password-confirm.validator';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Length,
    Validate,
} from 'class-validator';

export class ResetPasswordDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    OTP: string;

    @ApiProperty()
    @ApiProperty()
    @Length(6, 24)
    newPassword: string;

    @ApiProperty()
    @ApiProperty()
    @Validate(PasswordConfirmValidator, ['newPassword'])
    confirmPassword: string;
}
