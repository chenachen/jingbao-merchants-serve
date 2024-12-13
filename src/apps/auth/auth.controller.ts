import { Body, Controller, Get, Headers, Ip, Post, Query, Request } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { Public } from 'src/common/decorators/public.decorator'
import { ImageCaptchaDto } from './dto/captcha.dto'
import { ImageCaptcha, LoginRes } from './auth.interface'
import { AuthUser } from '../../common/decorators/auth-user.decorator'
import { TokenPayload } from '../../shared/token.service'
import { ExtractJwt } from 'passport-jwt'

@ApiTags('验证模块')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @Post('login')
    @ApiOperation({ summary: '登录接口' })
    async login(@Body() dto: LoginDto, @Ip() ip: string, @Headers('user-agent') ua: string): Promise<LoginRes> {
        return await this.authService.login(dto, ip, ua)
    }

    @Public()
    @Post('refreshToken')
    @ApiOperation({ summary: '更新accessToken' })
    async refreshToken(@Request() request, @Ip() ip: string, @Headers('user-agent') ua: string) {
        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request)
        return await this.authService.refreshToken(token, ip, ua)
    }

    @Get('captcha')
    @ApiOperation({ summary: '获取登录图片验证码' })
    @Public()
    async captchaByImg(@Query() dto: ImageCaptchaDto, @Ip() ip: string): Promise<ImageCaptcha> {
        return await this.authService.genCaptcha(dto, ip)
    }

    @ApiBearerAuth()
    @Post('logout')
    @ApiOperation({ summary: '登出接口' })
    async logout(@AuthUser() user: TokenPayload) {
        return await this.authService.logout(user)
    }
}
