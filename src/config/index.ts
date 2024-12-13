import { APP_CONFIG_TOKEN, AppConfig, IAppConfig } from './app.config'
import { IRedisConfig, REDIS_CONFIG_TOKEN, RedisConfig } from './redis.config'
import { ITokenConfig, TOKEN_CONFIG_TOKEN, TokenConfig } from './token.config'
import { IUploadConfig, UPLOAD_CONFIG_TOKEN, UploadConfig } from './upload.config'

export interface AllConfigType {
    [APP_CONFIG_TOKEN]: IAppConfig
    [REDIS_CONFIG_TOKEN]: IRedisConfig
    [TOKEN_CONFIG_TOKEN]: ITokenConfig
    [UPLOAD_CONFIG_TOKEN]: IUploadConfig
}

export default { AppConfig, RedisConfig, TokenConfig, UploadConfig }
