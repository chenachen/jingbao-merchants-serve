import { ApiProperty } from '@nestjs/swagger'
import { Length } from 'class-validator'
import { defaultLengthOptions } from '../../../common/validator/length'
import { IdDto } from '../../../common/dto/id.dto'

export class UpdatePasswordDto extends IdDto {
    @ApiProperty({ description: '旧密码' })
    @Length(8, 16, defaultLengthOptions)
    oldPassword: string

    @ApiProperty({ description: '新密码' })
    @Length(8, 16, defaultLengthOptions)
    newPassword: string
}
