import { Global, Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { LoggerModule } from './logger/logger.module'
import { RedisProvider } from './redis.provider'
import { TokenService } from './token.service'
import { JwtModule } from '@nestjs/jwt'

@Global()
@Module({
    exports: [PrismaService, RedisProvider, TokenService],
    providers: [PrismaService, RedisProvider, TokenService],
    imports: [LoggerModule.forRoot(), JwtModule.register({ global: true, secret: '' })],
})
export class SharedModule {}
