import { Role } from '@prisma/client'
import { Permission, PermissionCode } from '../../constant/permission.constant'

export function getPermissionCode(role: Role | null | undefined) {
    if (!role) {
        return []
    }

    const permissionList: PermissionCode[] = []

    function traverse(list: unknown[]) {
        list.forEach((item) => {
            const { selected, code, children } = item as Permission

            if (selected) {
                permissionList.push(code)
            }
            if (children) {
                traverse(children)
            }
        })
    }
    traverse(role.permissions)

    return permissionList
}
