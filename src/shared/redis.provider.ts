import { createClient } from 'redis'
import type { Provider } from '@nestjs/common'
import { IRedisConfig, REDIS_CONFIG_TOKEN } from 'src/config/redis.config'
import { ConfigService } from '@nestjs/config'
import { AllConfigType } from 'src/config'
import { LoggerService } from './logger/logger.service'

export const RedisProviderKey = 'REDIS_CLIENT'

export const RedisProvider: Provider = {
    provide: RedisProviderKey,
    useFactory: async (configService: ConfigService<AllConfigType>, loggerService: LoggerService) => {
        const { url } = configService.get<IRedisConfig>(REDIS_CONFIG_TOKEN)
        const client = createClient({
            url,
        }).on('error', (err) => {
            loggerService.error('redis client error', err)
        })

        await client.connect()

        return client
    },
    inject: [ConfigService, LoggerService],
} as const
