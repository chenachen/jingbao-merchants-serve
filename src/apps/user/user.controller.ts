import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { UserListDto } from './dto/user-list.dto'
import { IdDto } from '../../common/dto/id.dto'
import { UpdatePasswordDto } from './dto/update-password.dto'
import { AuthUser } from '../../common/decorators/auth-user.decorator'
import { TokenPayload } from '../../shared/token.service'

@ApiTags('用户管理')
@ApiBearerAuth()
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({ summary: '创建用户' })
    @Post('create')
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto)
    }

    @ApiOperation({ summary: '获取用户列表' })
    @Get('list')
    getList(@Query() userListDto: UserListDto) {
        return this.userService.getList(userListDto)
    }

    @ApiOperation({ summary: '获取单个用户信息' })
    @Get('getOne')
    findOne(@Query() { id }: IdDto) {
        return this.userService.findOne(+id)
    }

    @ApiOperation({ summary: '更新用户' })
    @Post('update')
    update(@Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(updateUserDto)
    }

    @ApiOperation({ summary: '删除用户' })
    @Post('delete')
    remove(@Query() { id }: IdDto) {
        return this.userService.remove(id)
    }

    @ApiOperation({ summary: '更新密码' })
    @Post('updatePassword')
    updatePassword(@Body() updatePasswordDto: UpdatePasswordDto, @AuthUser() user: TokenPayload) {
        return this.userService.updatePassword(updatePasswordDto, user)
    }
}
