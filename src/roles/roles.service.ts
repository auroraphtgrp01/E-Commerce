import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ExtendedPrismaClient } from 'src/services/prisma_customize.service';
import { CustomPrismaService } from 'nestjs-prisma';
import { Prisma, User } from '@prisma/client';
import { queryDatabaseWithFilter } from 'src/utils/queryDatabase';
@Injectable()
export class RolesService {
  constructor(@Inject('PrismaService') private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>) { }
  async create(createRoleDto: CreateRoleDto, userInfo: User) {
    const isExits = await this.prismaService.client.role.findFirst({
      where: {
        name: createRoleDto.name
      }
    })
    if (isExits) throw new HttpException('Role already exists', HttpStatus.BAD_REQUEST)
    const role = await this.prismaService.client.role.create({
      data: {
        name: createRoleDto.name,
        createdBy: {
          ...userInfo
        }
      }
    })
    console.time('createRoleDto.permissions.map')
    await Promise.all([
      createRoleDto.permissions.map(async (perm) => {
        await this.prismaService.client.includePermission.create({
          data: {
            permissionId: perm,
            roleId: role.id
          }
        })
      })
    ])
    console.timeEnd('createRoleDto.permissions.map')
    return role
  }

  async findAll(queryString: string) {
    const include = {
      Permission: {
        include: {
          Permission: {
            select: {
              name: true,
              path: true,
              method: true
            }
          }
        }
      }
    }
    return await queryDatabaseWithFilter(queryString, this.prismaService.client.role, include)
  }

  async findOne(id: string) {
    return await this.prismaService.client.role.findFirst({
      where: {
        id
      }
    })
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, userInfo: User) {
    if (Object.keys(updateRoleDto).length === 0) {
      throw new HttpException('Please provide at least one field to update', HttpStatus.BAD_REQUEST)
    }
    return await this.prismaService.client.role.update({
      where: {
        id
      },
      data: {
        name: updateRoleDto.name,
        description: updateRoleDto.description,
        updatedBy: {
          ...userInfo as any
        }
      }
    })
  }

  async remove(id: string, userInfo: User) {
    await Promise.all([
      this.prismaService.client.role.delete({
        where: {
          id
        }
      }),
      this.prismaService.client.role.update({
        where: {
          id
        },
        data: {
          deletedBy: {
            ...userInfo
          }
        }
      })
    ])
    return {
      message: 'Role deleted successfully'
    }
  }
  async restore(id: string, userInfo: User) {
    if ((await this.prismaService.client.role.findFirst({
      where: {
        AND: [
          {
            id
          }, {
            deletedAt: null
          }
        ]
      }
    }))) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND)
    }
    return await this.prismaService.client.role.update({
      where: {
        id
      },
      data: {
        deletedAt: null,
      }
    })
  }
  async deletePer(id: {
    id_permission: string,
    id_role: string
  }, userInfo: User) {
    return await this.prismaService.client.includePermission.delete({
      where: {
        permissionId: id.id_permission,
        roleId: id.id_role
      },
    })
  }
  async grantPermission(id: {
    id_permission: string,
    id_role: string
  }, userInfo: User) {
    return await this.prismaService.client.includePermission.create({
      data: {
        permissionId: id.id_permission,
        roleId: id.id_role,
        createdBy: {
          ...userInfo
        },
      }
    })
  }
}
