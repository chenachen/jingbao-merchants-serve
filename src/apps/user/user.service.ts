import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { PrismaService } from 'src/shared/prisma.service'
import { comparePassword, passwordEncryption } from '../../common/utils/password-encryption'
import { UserListDto } from './dto/user-list.dto'
import { excludeField } from '../../common/utils/prisma-helper'
import { User } from '@prisma/client'
import { BusinessException } from '../../common/exceptions/business.exception'
import { ErrorEnum } from '../../constant/response-code.constant'
import { UpdatePasswordDto } from './dto/update-password.dto'
import { TokenPayload } from '../../shared/token.service'
import { ResponseModel } from '../../common/models/response.model'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { PrismaErrorCode } from '../../constant/prisma-error-code.constant'
import { LoggerService } from '../../shared/logger/logger.service'

@Injectable()
export class UserService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly loggerService: LoggerService,
    ) {}

    async create(createUserDto: CreateUserDto) {
        try {
            const { password, ...otherData } = createUserDto

            await this.prismaService.user.create({
                data: {
                    password: await passwordEncryption(password),
                    ...otherData,
                },
            })
        } catch (e) {
            this.errHandler(e)
        }

        return ResponseModel.success({ message: '用户创建成功' })
    }

    async getList(userListDto: UserListDto) {
        const { sortOrder, sortName, take, skip, searchText, searchType } = userListDto

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

        const users = await this.prismaService.user.findMany({
            where,
            take,
            skip,
            orderBy,
            include: {
                role: {
                    select: {
                        name: true,
                    },
                },
            },
        })
        const total = await this.prismaService.user.count({
            where,
        })

        return {
            list: excludeField(users, ['password']),
            total,
        }
    }

    async findOne(id: number): Promise<Omit<User, 'password'> | null> {
        const user = await this.prismaService.user.findUnique({
            where: {
                id,
            },
        })

        return excludeField(user, ['password'])
    }

    async update(updateUserDto: UpdateUserDto) {
        try {
            const { id, ...data } = updateUserDto

            await this.prismaService.user.update({
                where: {
                    id,
                },
                data,
            })
        } catch (e) {
            this.errHandler(e)
        }
        return ResponseModel.success({ message: '更新用户成功' })
    }

    async remove(id: number) {
        try {
            await this.prismaService.user.delete({
                where: {
                    id,
                },
            })
        } catch (e) {
            this.errHandler(e)
        }
        return ResponseModel.success({ message: '删除用户成功' })
    }

    private errHandler(err: PrismaClientKnownRequestError | Error) {
        if (err instanceof PrismaClientKnownRequestError) {
            switch (err.code) {
                case PrismaErrorCode.NOT_UNIQUE:
                    throw new BusinessException(ErrorEnum.SYSTEM_USER_EXISTS)
                case PrismaErrorCode.RECORD_NOT_FOUND:
                    throw new BusinessException(ErrorEnum.USER_NOT_FOUND)
                case PrismaErrorCode.FOREIGN_KEY_ERROR:
                    throw new BusinessException(ErrorEnum.ROLE_NOT_EXIST)
                default:
                    this.loggerService.error(
                        `你有意外未处理的PrismaClientKnownRequestError，code为 ${err.code}`,
                        err.stack,
                        UserService.name,
                    )
            }
        }
        throw err
    }

    async updatePassword(updatePasswordDto: UpdatePasswordDto, userInfo: TokenPayload) {
        const { id } = userInfo

        const user = await this.prismaService.user.findUnique({
            where: {
                id,
            },
        })
        if (!user) {
            throw new BusinessException(ErrorEnum.USER_NOT_FOUND)
        }

        const { oldPassword, newPassword } = updatePasswordDto
        const pass = await comparePassword(oldPassword, user.password)

        if (!pass) {
            throw new BusinessException(ErrorEnum.INVALID_PASSWORD)
        }

        await this.prismaService.user.update({
            where: { id },
            data: {
                password: await passwordEncryption(newPassword),
            },
        })

        return ResponseModel.success({ message: '密码修改成功' })
    }
}
