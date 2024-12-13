import { ConsoleLogger, ConsoleLoggerOptions, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { APP_CONFIG_TOKEN } from 'src/config/app.config'
import { LogLevel } from 'src/constant/logger.constant'

import type { Logger as WinstonLogger } from 'winston'
import { config, createLogger, format, transports } from 'winston'

import 'winston-daily-rotate-file'

@Injectable()
export class LoggerService extends ConsoleLogger {
    private isDev = false
    private winstonLogger: WinstonLogger
    constructor(
        context: string,
        options: ConsoleLoggerOptions,
        private readonly configService: ConfigService,
    ) {
        super(context, options)

        this.isDev = this.configService.get(APP_CONFIG_TOKEN).isDev

        if (!this.isDev) {
            this.initWinstonLogger()
        }
    }

    private initWinstonLogger() {
        const baseConfig = {
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: 31, // 一个月
        }
        this.winstonLogger = createLogger({
            levels: config.npm.levels,
            format: format.combine(format.errors({ stack: true }), format.timestamp(), format.json()),
            transports: [
                new transports.DailyRotateFile({
                    ...baseConfig,
                    level: LogLevel.INFO,
                    filename: 'logs/app.%DATE%.log',
                    auditFile: 'logs/.audit/app.json',
                    format: format.combine(
                        format.timestamp(),
                        format.printf((info) => {
                            if (info.level === LogLevel.INFO) {
                                return JSON.stringify(info)
                            }
                            return ''
                        }),
                    ),
                }),
                new transports.DailyRotateFile({
                    ...baseConfig,
                    level: LogLevel.WARN,
                    filename: 'logs/app-warn.%DATE%.log',
                    auditFile: 'logs/.audit/app-warn.json',
                    format: format.combine(
                        format.timestamp(),
                        format.printf((info) => {
                            if (info.level === LogLevel.WARN) {
                                return JSON.stringify(info)
                            }
                            return ''
                        }),
                    ),
                }),
                new transports.DailyRotateFile({
                    ...baseConfig,
                    level: LogLevel.ERROR,
                    filename: 'logs/app-error.%DATE%.log',
                    auditFile: 'logs/.audit/app-error.json',
                    format: format.combine(
                        format.timestamp(),
                        format.printf((info) => {
                            if (info.level === LogLevel.ERROR) {
                                return JSON.stringify(info)
                            }
                            return ''
                        }),
                    ),
                }),
            ],
        })
    }

    log(message: any, context?: string) {
        if (this.isDev) {
            super.log(message, context)
        } else {
            this.winstonLogger.log(LogLevel.INFO, message, { context })
        }
    }

    warn(message: any, context?: string) {
        if (this.isDev) {
            super.warn(message, context)
        } else {
            this.winstonLogger.warn(LogLevel.WARN, message, { context })
        }
    }

    error(message: any, stack?: string, context?: string) {
        if (this.isDev) {
            super.error.apply(this, [message, stack, context])
        } else {
            const hasStack = !!context
            this.winstonLogger.error(LogLevel.ERROR, {
                context: hasStack ? context : stack,
                message: hasStack ? new Error(message) : message,
            })
        }
    }

    devLog(message: string, context?: string) {
        if (this.isDev) {
            this.log(message, context)
        }
    }
}
