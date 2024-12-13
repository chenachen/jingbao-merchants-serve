import { ApiProperty } from '@nestjs/swagger'
import { IsString, Length } from 'class-validator'
import { defaultStringOptions } from '../../../common/validator/string'
import { defaultLengthOptions } from '../../../common/validator/length'

export class LoginDto {
    @ApiProperty({ description: '帐号', example: 'cacaca' })
    @Length(4, 16, defaultLengthOptions)
    account: string

    @ApiProperty({ description: '密码', example: 'ccc,./123' })
    @Length(6, 32, defaultLengthOptions)
    password: string

    @ApiProperty({ description: '验证码标识' })
    @IsString(defaultStringOptions)
    captchaId: string

    @ApiProperty({ description: '用户输入的验证码' })
    @Length(4, 4, defaultLengthOptions)
    verifyCode: string
}
