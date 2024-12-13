import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import helmet from 'helmet'
import { registerSwagger } from './swagger'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
import { LoggerService } from './shared/logger/logger.service'
import { APP_CONFIG_TOKEN } from './config/app.config'
import { TransformInterceptor } from './lifecycle/Interceptors/transform.interceptor'
import { LoggingInterceptor } from './lifecycle/Interceptors/logging.interceptor'
import { GlobalExceptionsFilter } from './lifecycle/filters/global.exception'
import { AllConfigType } from './config'

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        bufferLogs: true,
    })

    // 获取环境变量
    const configService = app.get(ConfigService)
    const loggerService = app.get(LoggerService)
    const { port, isDev, globalPrefix } = configService.get<AllConfigType>(APP_CONFIG_TOKEN, {
        infer: true,
    })

    app.enableCors({ origin: '*', credentials: true })
    app.setGlobalPrefix(globalPrefix)

    // middleware
    app.use(helmet())
    app.useLogger(loggerService)
    // interceptors
    app.useGlobalInterceptors(new TransformInterceptor())
    isDev && app.useGlobalInterceptors(new LoggingInterceptor())
    // filter
    app.useGlobalFilters(new GlobalExceptionsFilter(isDev, loggerService))
    // pipe
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            disableErrorMessages: !isDev, // 生产环境不提示太具体的参数报错
        }),
    )

    // api doc
    isDev && registerSwagger(app)

    await app.listen(port, '0.0.0.0')
}

bootstrap()
