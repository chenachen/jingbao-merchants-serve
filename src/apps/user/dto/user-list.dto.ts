import { BaseQueryDto } from 'src/common/dto/base-query.dto'
import { IsIn, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UserListDto extends BaseQueryDto {
    @ApiProperty({ description: '需要排序的值' })
    @IsOptional()
    @IsIn(['id', 'account', 'nickname', 'createdAt', 'updatedAt'])
    sortName: string

    @ApiProperty({ description: '搜索值，支持模糊搜索' })
    @IsOptional()
    @IsIn(['id', 'account', 'nickname'])
    searchType: string
}
