import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { RolesService } from './roles.service'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { IdDto } from '../../common/dto/id.dto'
import { RoleListDto } from './dto/role-list.dto'

@ApiTags('角色管理')
@ApiBearerAuth()
@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) {}

    @ApiOperation({ summary: '创建角色' })
    @Post('create')
    create(@Body() createRoleDto: CreateRoleDto) {
        return this.rolesService.create(createRoleDto)
    }

    @ApiOperation({ summary: '获取默认角色信息' })
    @Get('info')
    getDefaultInfo() {
        return this.rolesService.getDefaultInfo()
    }

    @ApiOperation({ summary: '获取角色列表' })
    @Get('list')
    getList(@Query() roleListDto: RoleListDto) {
        return this.rolesService.getList(roleListDto)
    }

    @ApiOperation({ summary: '获取全部角色' })
    @Get('all')
    findAll() {
        return this.rolesService.findAll()
    }

    @ApiOperation({ summary: '获取角色详情' })
    @Get('getOne')
    findOne(@Query() { id }: IdDto) {
        return this.rolesService.findOne(id)
    }

    @ApiOperation({ summary: '更新角色' })
    @Post('update')
    update(@Body() updateRoleDto: UpdateRoleDto) {
        return this.rolesService.update(updateRoleDto)
    }

    @ApiOperation({ summary: '删除角色' })
    @Post('delete')
    remove(@Body() { id }: IdDto) {
        return this.rolesService.remove(+id)
    }
}
