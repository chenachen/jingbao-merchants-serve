import {
    ArrayNotEmpty,
    IsArray,
    IsBoolean,
    IsEnum,
    IsOptional,
    IsString,
    Length,
    ValidateNested,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { defaultLengthOptions } from '../../../common/validator/length'
import { Permission, PermissionCode } from '../../../constant/permission.constant'
import { Type } from 'class-transformer'

class PermissionItem {
    @IsString()
    title: string

    @IsBoolean()
    selected: boolean

    @IsEnum(PermissionCode)
    code: PermissionCode

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PermissionItem)
    children: Permission[]
}

export class CreateRoleDto {
    @ApiProperty({ description: '角色名' })
    @Length(2, 32, defaultLengthOptions)
    name: string

    @ApiProperty({ description: '权限列表' })
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => PermissionItem)
    permissions: Permission[]
}
