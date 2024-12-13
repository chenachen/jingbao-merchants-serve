import { SortOrder } from '../../constant/common.constant'
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator'
import { defaultIntOptions } from '../validator/int'
import { Transform } from 'class-transformer'
import { defaultEnumOptions } from '../validator/enum'
import { ApiProperty } from '@nestjs/swagger'

export abstract class BaseQueryDto {
    /*
     * 排序名称和搜索类型根据不同的模块需要自己实现
     * */
    abstract sortName: any
    abstract searchType: any

    @ApiProperty({ description: '升序 或者 降序', required: false })
    @IsOptional()
    @IsEnum(SortOrder, defaultEnumOptions)
    sortOrder: SortOrder

    @ApiProperty({ description: '偏移值' })
    @Transform(({ value }) => parseInt(value))
    @IsInt(defaultIntOptions)
    skip: number

    @ApiProperty({ description: '获取多少个项' })
    @Transform(({ value }) => parseInt(value))
    @IsInt(defaultIntOptions)
    take: number

    @ApiProperty({ description: '查询参数', required: false })
    @IsOptional()
    @IsString()
    searchText: string
}
