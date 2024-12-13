import { ApiProperty } from '@nestjs/swagger'
import { UserLevel } from '@prisma/client'
import { UserPayload } from '../../types/prisma'

interface UserCacheData {
    user: UserPayload
    ip: string
    ua: string
    refreshToken: string
    accessToken: string
}

export class UserCacheModel {
    @ApiProperty({ type: 'string', description: '用户帐号' })
    account: string

    @ApiProperty({ type: UserLevel, description: '用户等级' })
    userLevel: UserLevel

    @ApiProperty({ type: 'string', description: '用户角色ID' })
    roleId: number

    @ApiProperty({ type: 'string', description: '登录时用户IP' })
    ip: string

    @ApiProperty({ type: 'string', description: '浏览器的user-agent' })
    ua: string

    @ApiProperty({ type: 'string', description: '颁发给用户的refreshToken' })
    refreshToken: string

    @ApiProperty({ type: 'string', description: '颁发给用户的accessToken' })
    accessToken: string

    constructor(userCacheData: UserCacheData) {
        const { user, ip, ua, refreshToken, accessToken } = userCacheData
        const { account, level, roleId } = user

        this.account = account
        this.userLevel = level
        this.ip = ip
        this.ua = ua
        this.refreshToken = refreshToken
        this.accessToken = accessToken
        this.roleId = roleId
    }
}
