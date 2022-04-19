import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class SetTargerDto {
    @ApiProperty()
    @IsNumber()
    target: number;
}
