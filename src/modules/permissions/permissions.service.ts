import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { CreatePermissionDto } from './dto/create-permission.dto'
import { UpdatePermissionDto } from './dto/update-permission.dto'
import { CustomPrismaService } from 'nestjs-prisma'
import { ExtendedPrismaClient } from 'src/services/prisma_customize.service'
import { queryDatabaseWithFilter } from 'src/utils/queryDatabase'
import { User } from '@prisma/client'

@Injectable()
export class PermissionsService {
  constructor(@Inject('PrismaService') private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>) {}
  async create(createPermissionDto: CreatePermissionDto) {
    const isExist = await this.prismaService.client.permission.findFirst({
      where: {
        AND: [
          {
            path: createPermissionDto.path
          },
          {
            method: createPermissionDto.method
          }
        ]
      }
    })
    if (isExist) throw new HttpException('Permission already exists', HttpStatus.BAD_REQUEST)
    return await this.prismaService.client.permission.create({
      data: {
        ...createPermissionDto
      }
    })
  }

  async findAll(queryString: string) {
    return await queryDatabaseWithFilter(queryString, this.prismaService.client.permission)
  }

  async findOne(id: string) {
    return await this.prismaService.client.permission.findUnique({
      where: {
        id
      }
    })
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto, userInfo: User) {
    return await this.prismaService.client.permission.update({
      where: {
        id
      },
      data: {
        ...updatePermissionDto,
        updatedBy: {
          userId: userInfo.id,
          email: userInfo.email
        }
      }
    })
  }

  async remove(id: string, userInfo: User) {
    return await Promise.all([
      this.prismaService.client.permission.delete({
        where: {
          id
        }
      }),
      this.prismaService.client.permission.update({
        where: {
          id
        },
        data: {
          deletedBy: {
            userId: userInfo.id,
            email: userInfo.email
          }
        }
      })
    ])
  }
  async restore(id: string, userInfo: User) {
    return await this.prismaService.client.permission.update({
      where: {
        id
      },
      data: {
        deletedAt: null
      }
    })
  }
}
