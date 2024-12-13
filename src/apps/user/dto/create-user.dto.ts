import { UserLevel } from '@prisma/client'
import { IsEnum, IsInt, IsOptional, Length } from 'class-validator'
import { defaultLengthOptions } from 'src/common/validator/length'
import { ApiProperty } from '@nestjs/swagger'
import { defaultEnumOptions } from '../../../common/validator/enum'
import { defaultIntOptions } from '../../../common/validator/int'

export class CreateUserDto {
    @ApiProperty({ description: '帐号，需要唯一' })
    @Length(6, 16, defaultLengthOptions)
    account: string

    @ApiProperty({ description: '昵称' })
    @Length(2, 16, defaultLengthOptions)
    nickname: string

    @ApiProperty({ description: '密码' })
    @Length(8, 16, defaultLengthOptions)
    password: string

    @ApiProperty({ description: '用户等级', enum: UserLevel })
    @IsEnum(UserLevel, defaultEnumOptions)
    level: UserLevel

    @IsOptional()
    @ApiProperty({ description: '用户角色' })
    @IsInt(defaultIntOptions)
    roleId?: number
}
