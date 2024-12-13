import { Injectable } from '@nestjs/common'
import { FileUploadDto } from './dto/upload.dto'
import { ConfigService } from '@nestjs/config'
import { AllConfigType } from 'src/config'
import { IUploadConfig, UPLOAD_CONFIG_TOKEN } from 'src/config/upload.config'
import { extname, join, resolve } from 'path'
import {
    createReadStream,
    createWriteStream,
    existsSync,
    mkdirSync,
    readdirSync,
    readFileSync,
    unlinkSync,
    writeFileSync,
} from 'fs'
import { ResponseModel } from 'src/common/models/response.model'
import { LoggerService } from 'src/shared/logger/logger.service'
import { BusinessException } from 'src/common/exceptions/business.exception'
import { ErrorEnum } from 'src/constant/response-code.constant'
import { createHash, randomBytes } from 'crypto'
import { MergeFileDto } from './dto/merge.dto'

@Injectable()
export class UploadService {
    private readonly uploadTempDir: string
    private uploadTargetDir: string

    constructor(
        private readonly configService: ConfigService<AllConfigType>,
        private readonly loggerService: LoggerService,
    ) {
        const { dir } = this.configService.get<IUploadConfig>(UPLOAD_CONFIG_TOKEN)
        this.uploadTempDir = resolve(dir, './temp')
        this.uploadTargetDir = resolve(dir, './files')
    }

    async saveFile(fileUploadDto: FileUploadDto) {
        const { file, id, index } = fileUploadDto
        const tempPath = resolve(this.uploadTempDir, id)

        if (!existsSync(tempPath)) {
            mkdirSync(tempPath, { recursive: true })
        }

        try {
            const randomFileName = `${randomBytes(16).toString('hex')}-${index}`
            const filePath = join(tempPath, randomFileName)

            writeFileSync(filePath, file.buffer)

            return ResponseModel.success({ message: '文件上传成功' })
        } catch (err) {
            this.loggerService.error(err.message, err.stack, UploadService.name)
            throw new BusinessException(ErrorEnum.UPLOAD_FILE_FAIL)
        }
    }

    async mergeFile(mergeFileDto: MergeFileDto) {
        const { id, hash, filename } = mergeFileDto

        const ext = extname(filename)
        const tempFolder = join(this.uploadTempDir, id)
        const randomFileName = `${randomBytes(16).toString('hex')}.${ext}`
        const finalFilePath = join(this.uploadTargetDir, randomFileName)
        const writeStream = createWriteStream(finalFilePath)

        try {
            const fileList = readdirSync(tempFolder).map((item) => join(tempFolder, item))
            fileList.sort((a, b) => {
                const [, aIndex] = a.split('-')
                const [, bIndex] = b.split('-')

                return Number(aIndex) - Number(bIndex)
            })

            fileList.forEach((file) => {
                const chunk = readFileSync(file)
                writeStream.write(chunk)
                unlinkSync(file)
            })
            writeStream.end()

            const fileHash = await new Promise((resolve) => {
                writeStream.on('finish', () => {
                    const currHash = createHash('md5')
                    const readStream = createReadStream(finalFilePath)

                    readStream.on('data', (data) => {
                        currHash.update(data)
                    })

                    readStream.on('end', () => {
                        const calculatedHash = currHash.digest('hex')

                        resolve(calculatedHash)
                    })
                })
            })

            if (fileHash !== hash) {
                throw new Error(`文件不完整, 文件合并后hash为 ${fileHash}, 前端传过来为${hash}`)
            }

            return ResponseModel.success({ message: '文件合并成功' })
        } catch (err) {
            this.loggerService.error(err.message, err.stack, UploadService.name)
            throw new BusinessException(ErrorEnum.MERGE_FILE_FAIL)
        }
    }
}
