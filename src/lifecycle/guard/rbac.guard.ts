import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { PERMISSION_KEY, PUBLIC_KEY } from '../../constant/auth.constant'
import { Request } from 'express'
import { PermissionCode } from '../../constant/permission.constant'
import { TokenPayload } from '../../shared/token.service'
import { UserLevel } from '@prisma/client'
import { RolesService } from '../../apps/roles/roles.service'

@Injectable()
export class RbacGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly roleService: RolesService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<any> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ])

        if (isPublic) {
            return true
        }

        const request = context.switchToHttp().getRequest<Request>()

        const user = request.user as TokenPayload
        if (!user) {
            throw new UnauthorizedException('用户未登录')
        }

        const permissionCode = this.reflector.getAllAndOverride<PermissionCode | PermissionCode[]>(PERMISSION_KEY, [
            context.getHandler(),
            context.getClass(),
        ])

        // 没有设置权限守卫默认放行
        if (!permissionCode) {
            return true
        }

        // 管理员放行
        if (user.level === UserLevel.ADMIN) {
            return true
        }

        const userPermissions = await this.roleService.getAllPermissionCode(user.roleId)
        const arr = Array.isArray(permissionCode) ? permissionCode : [permissionCode]
        const pass = arr.some((item) => userPermissions.includes(item))

        if (!pass) {
            throw new ForbiddenException('权限不足')
        }

        return true
    }
}
