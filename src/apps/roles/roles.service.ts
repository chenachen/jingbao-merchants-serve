import { Inject, Injectable } from '@nestjs/common'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { PERMISSION_LIST, PermissionCode } from '../../constant/permission.constant'
import { PrismaService } from '../../shared/prisma.service'
import { BusinessException } from '../../common/exceptions/business.exception'
import { ErrorEnum } from '../../constant/response-code.constant'
import { ResponseModel } from '../../common/models/response.model'
import { RoleListDto } from './dto/role-list.dto'
import { PrismaErrorCode } from '../../constant/prisma-error-code.constant'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { LoggerService } from '../../shared/logger/logger.service'
import { RedisProviderKey } from '../../shared/redis.provider'
import { RedisClientType } from 'redis'
import { getPermissionCodeKey } from '../../common/utils/getRedisKey'
import { getPermissionCode } from '../../common/utils/permission'

@Injectable()
export class RolesService {
    constructor(
        @Inject(RedisProviderKey) private redisService: RedisClientType,
        private readonly prismaService: PrismaService,
        private readonly loggerService: LoggerService,
    ) {}

    async create(createRoleDto: CreateRoleDto) {
        const { name, permissions } = createRoleDto

        try {
            await this.prismaService.role.create({
                data: {
                    name,
                    permissions: permissions as Record<string, any>[],
                },
            })
        } catch (err) {
            this.errHandler(err)

            throw new Error(err)
        }

        return ResponseModel.success({ message: '创建角色成功' })
    }

    async getList(roleListDto: RoleListDto) {
        const { sortOrder, sortName, take, skip, searchText, searchType } = roleListDto

        const orderBy = {
            [sortName]: sortOrder,
        }

        let where
        if (searchType && searchText) {
            where = {
                [searchType]: {
                    contains: searchText,
                },
            }
        }

        return await this.prismaService.role.findMany({
            where,
            take,
            skip,
            orderBy,
        })
    }

    findAll() {
        return this.prismaService.role.findMany({
            select: {
                id: true,
                name: true,
            },
        })
    }

    async findOne(id: number) {
        return this.prismaService.role.findUnique({
            where: {
                id,
            },
        })
    }

    async update(updateRoleDto: UpdateRoleDto) {
        const { id, name, permissions } = updateRoleDto

        try {
            await this.prismaService.role.update({
                where: {
                    id,
                },
                data: {
                    name,
                    permissions: permissions as Record<string, any>[],
                },
            })
        } catch (err) {
            this.errHandler(err)
        }

        return ResponseModel.success({ message: '更新角色成功' })
    }

    private errHandler(err: PrismaClientKnownRequestError | Error) {
        if (err instanceof PrismaClientKnownRequestError) {
            switch (err.code) {
                case PrismaErrorCode.NOT_UNIQUE:
                    throw new BusinessException(ErrorEnum.ROLE_EXIST)
                case PrismaErrorCode.RECORD_NOT_FOUND:
                    throw new BusinessException(ErrorEnum.ROLE_NOT_EXIST)
                default:
                    this.loggerService.error(
                        `你有意外未处理的PrismaClientKnownRequestError，code为 ${err.code}`,
                        err.stack,
                        RolesService.name,
                    )
            }
        }
        throw err
    }

    async remove(id: number) {
        try {
            await this.prismaService.role.delete({
                where: { id },
            })
        } catch (err) {
            this.errHandler(err)
        }

        return ResponseModel.success({ message: '删除角色成功' })
    }

    getDefaultInfo() {
        return PERMISSION_LIST
    }

    async getAllPermissionCode(id: number) {
        const key = getPermissionCodeKey(id)
        let permissionCode: PermissionCode[]

        try {
            permissionCode = JSON.parse(await this.redisService.get(key))
        } catch (e) {}

        if (!permissionCode) {
            const role = await this.findOne(id)

            permissionCode = getPermissionCode(role)
        }

        return permissionCode
    }
}
