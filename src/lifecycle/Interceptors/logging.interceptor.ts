import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common'
import { Observable, tap } from 'rxjs'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private logger = new Logger(LoggingInterceptor.name, { timestamp: false })

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const request = context.switchToHttp().getRequest()
        const content = `${request.method} -> ${request.url}`
        this.logger.debug(`接收请求：${content}`)
        const now = Date.now()

        return next.handle().pipe(
            tap(() => {
                this.logger.debug(`返回响应：${content} +${Date.now() - now}ms`)
            }),
        )
    }
}
