import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsInt, IsUUID } from "class-validator";
import { randomUUID } from "crypto";
import { defaultIntOptions } from "src/common/validator/int";

export class FileUploadDto {
    @ApiProperty({ type: 'string', description: '文件', format: 'binary' })
    file: Express.Multer.File

    @ApiProperty({ type: 'string', example: randomUUID(), description: '唯一标识ID，用UUID生成' })
    @IsUUID('all', {message: 'id必须为UUID'})
    id: string

    @ApiProperty({ type: 'string', example: randomUUID(), description: '当前切片顺序，后续合并文件会按此顺序进行合并' })
    @Transform(({ value }) => parseInt(value))
    @IsInt(defaultIntOptions)
    index: number
}
