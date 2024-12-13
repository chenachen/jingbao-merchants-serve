import { applyDecorators, SetMetadata } from '@nestjs/common'
import { PERMISSION_KEY } from 'src/constant/auth.constant'
import { PermissionCode } from 'src/constant/permission.constant'

/** 资源操作需要特定的权限 */
export function Permission(permission: PermissionCode | PermissionCode[]) {
    return applyDecorators(SetMetadata(PERMISSION_KEY, permission))
}
