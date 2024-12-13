import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'
import { defaultIntOptions } from '../validator/int'
import { Transform } from 'class-transformer'

export class IdDto {
    @ApiProperty({ description: 'id，整数' })
    @Transform(({ value }) => parseInt(value))
    @IsInt(defaultIntOptions)
    id: number
}
