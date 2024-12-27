import { ForbiddenException, Inject, Injectable } from '@nestjs/common'

import * as svgCaptcha from 'svg-captcha'

import { RedisProviderKey } from 'src/shared/redis.provider'
import { genCaptchaImgKey, getUserCacheKey } from 'src/common/utils/getRedisKey'
import { BusinessException } from 'src/common/exceptions/business.exception'
import { generateUUID } from 'src/common/utils/tools'
import { ErrorEnum } from 'src/constant/response-code.constant'
import { LoginDto } from './dto/login.dto'
import { ImageCaptchaDto } from './dto/captcha.dto'

import { ImageCaptcha } from './auth.interface'
import { comparePassword } from 'src/common/utils/password-encryption'
import { PrismaService } from 'src/shared/prisma.service'
import { RedisClientType } from 'redis'
import { LoggerService } from 'src/shared/logger/logger.service'
import { TokenPayload, TokenService } from 'src/shared/token.service'
import { UserCacheModel } from 'src/common/models/user-cache.model'
import { UserPayload } from '../../types/prisma'
import { ConfigService } from '@nestjs/config'
import { LOGIN_CONFIG_TOKEN, type ILoginConfig } from 'src/config/login.config'
import dayjs from 'dayjs'

@Injectable()
export class AuthService {
    constructor(
        @Inject(RedisProviderKey) private redisService: RedisClientType,
        private readonly prismaService: PrismaService,
        private readonly loggerService: LoggerService,
        private readonly tokenService: TokenService,
        private readonly configService: ConfigService,
    ) {}

    async genCaptcha(dto: ImageCaptchaDto, ip: string): Promise<ImageCaptcha> {
        const { width, height } = dto

        const svg = svgCaptcha.create({
            size: 4,
            color: true,
            noise: 4,
            width: width ?? 100,
            height: height ?? 50,
            charPreset: '1234567890',
        })
        const result = {
            img: `data:image/svg+xml;base64,${Buffer.from(svg.data).toString('base64')}`,
            id: generateUUID(),
        }
        const redisKey = genCaptchaImgKey(result.id)
        await this.redisService.hSet(redisKey, {
            code: svg.text,
            ip,
        })
        // 1分钟过期时间
        this.redisService.expire(redisKey, 60)

        this.loggerService.devLog(`生成的验证码是： ${svg.text}, id 是 ${result.id}`, AuthService.name)

        return result
    }

    /**
     * 校验图片验证码
     */
    private async checkImgCaptcha(captchaId: string, verifyCode: string, requestIp: string): Promise<void> {
        const cacheKey = genCaptchaImgKey(captchaId)
        const { ip, code } = (await this.redisService.hGetAll(cacheKey)) ?? {
            ip: null,
            code: null,
        }
        // 校验成功后移除验证码
        this.redisService.del(cacheKey)

        if (verifyCode.toLowerCase() !== code?.toLowerCase() || requestIp !== ip) {
            this.loggerService.warn(
                `用户输入： ip: ${requestIp}，code：${verifyCode}, 实际：ip: ${ip}, code: ${code}`,
                AuthService.name,
            )
            throw new BusinessException(ErrorEnum.INVALID_VERIFICATION_CODE)
        }
    }

    private setUserLoginAttempts(account: string, loginAttempts: number) {
        return this.prismaService.user.update({
            where: {
                account,
            },
            data: {
                loginAttempts,
                lastAttemptTime: new Date(),
            },
        })
    }

    async login(dto: LoginDto, ip: string, ua: string) {
        const { account, password, captchaId, verifyCode } = dto

        // 先检查验证码
        await this.checkImgCaptcha(captchaId, verifyCode, ip)

        const user = await this.prismaService.user.findUnique({
            where: {
                account,
            },
            include: {
                role: true,
            },
        })

        if (!user) {
            throw new BusinessException(ErrorEnum.INVALID_USERNAME_PASSWORD)
        }

        // 判断账号是否处于限制登录状态
        const { MAX_LOGIN_ATTEMPTS, LOGIN_ATTEMPT_GAP } = this.configService.get<ILoginConfig>(LOGIN_CONFIG_TOKEN)
        const { lastAttemptTime } = user
        let loginAttempts = user.loginAttempts
        if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
            if (dayjs(lastAttemptTime).add(LOGIN_ATTEMPT_GAP, 'minute').isBefore(dayjs())) {
                loginAttempts = 0
            } else {
                throw new BusinessException(ErrorEnum.LIMIT_LOGIN)
            }
        }

        // 判断密码是否正确
        const compareResult = await comparePassword(password, user.password)
        if (!compareResult) {
            loginAttempts += 1
            await this.setUserLoginAttempts(account, loginAttempts)

            throw new BusinessException(ErrorEnum.INVALID_USERNAME_PASSWORD, { loginAttempts })
        }

        this.setUserLoginAttempts(account, 0)
        const payload = {
            account: user.account,
            type: user.type,
            id: user.id,
            nickname: user.nickname,
            roleId: user.roleId,
        }
        const token = await this.tokenService.generateToken(payload)

        this.setUserCache({
            user: user as UserPayload,
            ip,
            ua,
            ...token,
        })

        return token
    }

    private setUserCache(params: {
        ip: string
        ua: string
        accessToken: string
        user: UserPayload
        refreshToken: string
    }) {
        const userCacheData = new UserCacheModel(params)
        const {
            user: { account },
        } = params

        const cacheKey = getUserCacheKey(account)

        this.redisService.hSet(cacheKey, { ...userCacheData })
    }

    async logout(user: TokenPayload) {
        const { account } = user
        const redisKey = getUserCacheKey(account)

        await this.redisService.del(redisKey)
    }

    async refreshToken(token: string, currIp: string, currUa: string) {
        try {
            const payload = await this.tokenService.verifyRefreshToken(token)
            delete payload.exp
            delete payload.iat
            const cacheKey = getUserCacheKey(payload.account)
            const userCache = (await this.redisService.hGetAll(cacheKey)) as unknown as UserCacheModel
            const { refreshToken, ip, ua } = userCache

            if (refreshToken === token && currUa === ua && ip === currIp) {
                const accessToken = await this.tokenService.generateAccessToken(payload)

                this.redisService.hSet(cacheKey, {
                    ...userCache,
                    accessToken,
                })

                return {
                    accessToken,
                }
            } else {
                throw new Error('refresh token 校验失败')
            }
        } catch (err) {
            this.loggerService.error(err.message, err.stack, AuthService.name)
            throw new ForbiddenException('登录已过期')
        }
    }
}
