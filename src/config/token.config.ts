import { ConfigType, registerAs } from '@nestjs/config'

export const TOKEN_CONFIG_TOKEN = 'token'

export const TokenConfig = registerAs(TOKEN_CONFIG_TOKEN, () => {
    const { REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRE, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRE } = process.env
    return {
        refreshTokenOptions: {
            secret: REFRESH_TOKEN_SECRET,
            expiresIn: `${REFRESH_TOKEN_EXPIRE}s`,
        },
        accessTokenOptions: {
            secret: ACCESS_TOKEN_SECRET,
            expiresIn: `${ACCESS_TOKEN_EXPIRE}s`,
        },
    }
})

export type ITokenConfig = ConfigType<typeof TokenConfig>
