import { CreateRoleDto } from './create-role.dto'
import { IsInt } from 'class-validator'
import { defaultIntOptions } from '../../../common/validator/int'

export class UpdateRoleDto extends CreateRoleDto {
    @IsInt(defaultIntOptions)
    id: number
}
