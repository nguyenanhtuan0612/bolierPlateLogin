import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsISO8601, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @ApiProperty()
    @IsString()
    firstName: string;

    @IsOptional()
    @ApiProperty()
    @IsString()
    lastName: string;

    @IsOptional()
    @ApiProperty()
    @IsString()
    gender: string;

    @IsOptional()
    @ApiProperty()
    @IsString()
    avatarImage: string;

    @IsOptional()
    @ApiProperty()
    @IsBoolean()
    active: boolean;

    @IsOptional()
    @ApiProperty()
    @IsString()
    phone: string;

    @IsOptional()
    @ApiProperty()
    @IsString()
    otp: string;

    @IsOptional()
    @ApiProperty()
    @IsString()
    backgroundImage: string;

    @IsOptional()
    @ApiProperty()
    @IsISO8601()
    birthday: string;
}
