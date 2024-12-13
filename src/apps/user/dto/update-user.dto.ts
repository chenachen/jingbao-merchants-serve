import { OmitType, PartialType } from '@nestjs/swagger'
import { CreateUserDto } from './create-user.dto'
import { IsInt } from 'class-validator'
import { defaultIntOptions } from '../../../common/validator/int'

const excludesField: (keyof CreateUserDto)[] = ['password', 'account']

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, excludesField)) {
    @IsInt(defaultIntOptions)
    id: number
}
