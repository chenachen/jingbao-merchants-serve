import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsUUID } from 'class-validator'
import { randomUUID } from 'crypto'
import { defaultStringOptions } from 'src/common/validator/string'

export class MergeFileDto {
    @ApiProperty({ type: 'string', example: randomUUID(), description: '需要合并的文件的ID' })
    @IsUUID('all', { message: 'id必须为UUID' })
    id: string

    @ApiProperty({ type: 'string', description: '文件的md5 hash，用于校验文件完整性' })
    @IsString(defaultStringOptions)
    hash: string

    @ApiProperty({
        type: 'string',
        description: '文件名，存数据库的文件名，出于安全考虑文件不会以这个文件名去保存到服务器',
    })
    @IsString(defaultStringOptions)
    filename: string
}
