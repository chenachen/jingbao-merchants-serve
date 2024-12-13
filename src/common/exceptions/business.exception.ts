import { HttpException, HttpStatus } from '@nestjs/common'
import { ErrorEnum, SUCCESS_CODE } from 'src/constant/response-code.constant'

export class BusinessException extends HttpException {
    private readonly errorCode: number

    constructor(error: ErrorEnum | string) {
        // 如果是非 ErrorEnum
        if (!error.includes(':')) {
            super(
                HttpException.createBody({
                    code: SUCCESS_CODE,
                    message: error,
                }),
                HttpStatus.OK,
            )
            this.errorCode = SUCCESS_CODE
            return
        }

        const [code, message] = error.split(':')
        super(
            HttpException.createBody({
                code: Number(code),
                message,
            }),
            HttpStatus.OK,
        )

        this.errorCode = Number(code)
    }

    getErrorCode(): number {
        return this.errorCode
    }
}
