import { BaseQueryDto } from 'src/common/dto/base-query.dto'
import { IsIn, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class RoleListDto extends BaseQueryDto {
    @ApiProperty({ description: '需要排序的值' })
    @IsOptional()
    @IsIn(['name', 'createdAt', 'updatedAt'])
    sortName: string

    @ApiProperty({ description: '搜索值，支持模糊搜索' })
    @IsOptional()
    @IsIn(['name'])
    searchType: string
}
