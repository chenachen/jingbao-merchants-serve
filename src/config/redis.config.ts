import { ConfigType, registerAs } from '@nestjs/config'

export const REDIS_CONFIG_TOKEN = 'redis'

export const RedisConfig = registerAs(REDIS_CONFIG_TOKEN, () => {
    const { REDIS_USERNAME, REDIS_PASSWORD, REDIS_HOST, REDIS_PORT } = process.env
    return {
        url: `redis://${REDIS_USERNAME}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`,
    }
})

export type IRedisConfig = ConfigType<typeof RedisConfig>
