import { ApiProperty } from '@nestjs/swagger';
import { PasswordConfirmValidator } from 'src/validators/password-confirm.validator';
import { IsString, Length, Validate } from 'class-validator';

export class ChangePasswordDto {
    @ApiProperty()
    @IsString()
    oldPassword: string;

    @ApiProperty()
    @IsString()
    @Length(6, 24)
    newPassword: string;

    @ApiProperty()
    @IsString()
    @Validate(PasswordConfirmValidator, ['newPassword'])
    confirmPassword: string;
}
