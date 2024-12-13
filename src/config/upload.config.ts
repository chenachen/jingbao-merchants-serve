import { ConfigType, registerAs } from '@nestjs/config'
import { resolve } from 'path'

export const UPLOAD_CONFIG_TOKEN = 'upload'

export const UploadConfig = registerAs(UPLOAD_CONFIG_TOKEN, () => {
    const { UPLOAD_FILE_DIR } = process.env
    const dir = UPLOAD_FILE_DIR ? UPLOAD_FILE_DIR : resolve(process.cwd(), './upload')
    return {
        dir,
    }
})

export type IUploadConfig = ConfigType<typeof UploadConfig>
