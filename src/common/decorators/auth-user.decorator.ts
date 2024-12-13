import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { TokenPayload } from '../../shared/token.service'

/**
 * @description 获取当前登录用户信息, 并挂载到request上
 */
export const AuthUser = createParamDecorator((data: keyof TokenPayload, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    // auth guard will mount this
    const user = request.user

    return data ? user?.[data] : user
})
