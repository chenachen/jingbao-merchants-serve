import { Gender, UserType } from '@prisma/client'
import { IsEnum, IsOptional, Length } from 'class-validator'
import { defaultLengthOptions } from 'src/common/validator/length'
import { ApiProperty } from '@nestjs/swagger'
import { defaultEnumOptions } from '../../../common/validator/enum'

export class CreateUserDto {
    @ApiProperty({ description: '帐号，需要唯一' })
    @Length(6, 16, defaultLengthOptions)
    account: string

    @ApiProperty({ description: '密码' })
    @Length(8, 16, defaultLengthOptions)
    password: string

    @ApiProperty({ description: '手机号码' })
    @Length(11, 11, defaultLengthOptions)
    phone: string

    @ApiProperty({ description: '邮箱' })
    @Length(10, 50, defaultLengthOptions)
    email: string

    @ApiProperty({ description: '昵称' })
    @Length(2, 16, defaultLengthOptions)
    nickname: string

    @ApiProperty({ description: '真实姓名' })
    @Length(2, 16, defaultLengthOptions)
    name: string

    @ApiProperty({ description: '身份证号' })
    @Length(18, 18, defaultLengthOptions)
    idNumber: string

    @ApiProperty({ description: '用户类型', enum: UserType })
    @IsEnum(UserType, defaultEnumOptions)
    type: UserType

    @ApiProperty({ description: '性别', enum: Gender })
    @IsEnum(Gender, defaultEnumOptions)
    gender: Gender

    @IsOptional()
    @ApiProperty({ description: '生日', default: '1997-07-07' })
    @Length(10, 10, defaultLengthOptions)
    birthday?: string

    @IsOptional()
    @ApiProperty({ description: '头像' })
    @Length(10, 10, defaultLengthOptions)
    avatar?: string
}
