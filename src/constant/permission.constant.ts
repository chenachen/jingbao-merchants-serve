export enum PermissionCode {
    HOME_VIEW = 'HOME>VIEW',
    USER_VIEW = 'USER>VIEW',
    USER_UPDATE = 'USER>UPDATE',
    USER_DELETE = 'USER>DELETE',
}

export interface Permission {
    title: string
    selected: boolean
    code: PermissionCode
    children?: Permission[] // children下的权限需要基于本权限
}

export const PERMISSION_LIST: Permission[] = [
    {
        title: '首页',
        selected: true,
        code: PermissionCode.HOME_VIEW,
    },
    {
        title: '用户',
        selected: false,
        code: PermissionCode.USER_VIEW,
        children: [
            {
                title: '更新',
                selected: false,
                code: PermissionCode.USER_UPDATE,
            },
            {
                title: '删除',
                selected: false,
                code: PermissionCode.USER_DELETE,
            },
        ],
    },
] as const
