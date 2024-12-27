import { ConfigType, registerAs } from '@nestjs/config'

export const LOGIN_CONFIG_TOKEN = 'login'

export const LoginConfig = registerAs(LOGIN_CONFIG_TOKEN, () => {
    const { MAX_LOGIN_ATTEMPTS, LOGIN_ATTEMPT_GAP } = process.env
    return {
        MAX_LOGIN_ATTEMPTS: Number(MAX_LOGIN_ATTEMPTS),
        LOGIN_ATTEMPT_GAP: Number(LOGIN_ATTEMPT_GAP),
    }
})

export type ILoginConfig = ConfigType<typeof LoginConfig>
