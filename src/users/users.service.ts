import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { AddressDto, GrantRole, RegisterAgency, RegisterCustomer } from './dto/create-user.dto'
import { UpdateAgencyDto, UpdateUserDto } from './dto/update-user.dto'
import { hashPassword } from 'src/utils/hashPassword'
import aqp from 'api-query-params'
import { PopulateOptions } from 'mongoose'
import { queryDatabaseWithFilter } from 'src/utils/queryDatabase'
import { PrismaClient, User } from '@prisma/client'
import { CustomPrismaService } from 'nestjs-prisma'
import { ExtendedPrismaClient } from 'src/services/prisma_customize.service'

@Injectable()
export class UsersService {
  constructor(@Inject('PrismaService')
  private prismaService: CustomPrismaService<ExtendedPrismaClient>) { }

  async register(registerCustomer: RegisterCustomer) {
    const isExist = await this.prismaService.client.user.findUnique({
      where: {
        email: registerCustomer.email
      }
    })
    if (isExist) throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST)
    const hashP = await hashPassword(registerCustomer.password)
    const result = await this.prismaService.client.user.create({
      data: {
        ...registerCustomer,
        password: hashP
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        gender: true
      }
    })
    const isValid = await this.prismaService.client.customer.findUnique({
      where: {
        userId: result.id
      }
    })
    if (isValid) throw new HttpException('Customer already exists', HttpStatus.BAD_REQUEST)
    await this.prismaService.client.customer.create({
      data: {
        userId: result.id
      }
    })
    return {
      message: 'Customer registered successfully',
      data: result
    }
  }

  async registerAgency(registerAgency: RegisterAgency) {
    const isValid = await this.prismaService.client.user.findUnique({
      where: {
        id: registerAgency.userId
      }, select: {
        id: true,
        password: false,
        email: true,
        name: true,
      }
    })
    console.log(isValid);
    const pickupAddress = registerAgency.pickupAddress
    delete registerAgency.pickupAddress
    if (!isValid) throw new HttpException('User not found - Please Register a new User to Register Agency !', HttpStatus.UNAUTHORIZED)
    const result = await this.prismaService.client.agency.create({
      data: {
        ...registerAgency as any
      }
    })
    await this.prismaService.client.address.create({
      data: {
        agencyId: result.id,
        address: pickupAddress,
        name: 'Pickup Address',
      }
    })
    return {
      message: 'Agency registered successfully',
      userInfo: isValid,
      data: result
    }
  }

  async findAll(queryString: string) {
    const result = await queryDatabaseWithFilter(queryString, this.prismaService.client.user)
    return {
      message: 'Data fetched successfully',
      result
    }
  }

  async findOne(id: string) {
    const result = await this.prismaService.client.user.findUnique({
      where: {
        id
      },
      include: {
        Agency: true,
        Customer: true,
        Notification: true
      }
    })
    return {
      message: 'Data fetched successfully',
      data: (delete result?.password, result)
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    delete updateUserDto.password
    const user = await this.prismaService.client.user.update({
      where: {
        id: id
      },
      data: {
        ...updateUserDto
      }
    })
    return {
      message: 'User updated successfully',
      data: (user.password, user)
    }
  }
  async updateAgency(id, updateAgencyDto: UpdateAgencyDto, userId: string) {
    // const user = await this.prismaService.client.user.findUnique({
    //   where: {
    //     id: userId
    //   }
    // })
    // if (!user) throw new HttpException('User not found', HttpStatus.UNAUTHORIZED)
    const result = await this.prismaService.client.agency.update({
      where: {
        id
      }, data: {
        ...updateAgencyDto as any
      }
    })
    return {
      message: 'Agency updated successfully',
      data: result
    }
  }

  async findUserByEmail(email: string) {
    const user = await this.prismaService.client.user.findUnique({
      where: {
        email
      }
    })
    return user
  }
  async getAddress(queryString: string, id: string) {
    const { filter } = aqp(queryString)
    let result
    if (filter.types === 'agency') {
      result = await this.prismaService.client.address.findMany({
        where: {
          agencyId: id
        },
        select: {
          address: true,
          name: true,
          description: true
        }
      })
    }
    if (filter.types === 'customer') {
      result = await this.prismaService.client.address.findMany({
        where: {
          customerId: id
        },
        select: {
          address: true,
          name: true,
          description: true
        }
      })
    }
    return {
      message: 'Data fetched successfully',
      data: result
    }
  }
  async createAddress(addressDto: AddressDto, queryString: string) {
    const { filter } = aqp(queryString)
    const userId = addressDto.userId
    delete addressDto.userId
    if (filter.types === 'agency') {
      const result = await this.prismaService.client.address.create({
        data: {
          ...addressDto,
          agencyId: userId
        }
      })
      return {
        message: 'Address created successfully',
        data: result
      }
    }
    if (filter.types === 'customer') {
      const result = await this.prismaService.client.address.create({
        data: {
          ...addressDto,
          customerId: userId
        }
      })
      return {
        message: 'Address created successfully',
        data: result
      }
    }
    throw new HttpException('Invalid type', HttpStatus.BAD_REQUEST)
  }
  async updateAddress(id: string, addressDto: AddressDto, queryString: string) {
    const { filter } = aqp(queryString)
    const userId = addressDto.userId
    delete addressDto.userId
    if (filter.types === 'agency') {
      const result = await this.prismaService.client.address.updateMany({
        where: {
          AND: [
            {
              id: id
            },
            {
              agencyId: userId
            }
          ]
        },
        data: {
          ...addressDto
        }
      })
      return {
        message: 'Address updated successfully',
        data: result
      }
    }
    if (filter.types === 'customer') {
      const result = await this.prismaService.client.address.updateMany({
        where: {
          AND: [
            {
              id: id
            },
            {
              customerId: userId
            }
          ]
        },
        data: {
          ...addressDto
        }
      })
      return {
        message: 'Address updated successfully',
        data: result
      }
    }
    throw new HttpException('Invalid type', HttpStatus.BAD_REQUEST)
  }

  async removeUser(id: string) {
    const [customer, agency] = await Promise.all([
      this.prismaService.client.customer.findUnique({
        where: {
          userId: id
        }
      }),
      this.prismaService.client.agency.findUnique({
        where: {
          userId: id
        }
      })
    ])
    await Promise.all([
      customer ? this.prismaService.client.customer.delete({
        where: {
          userId: id
        }
      }) : null
      ,
      agency ? this.prismaService.client.agency.delete({
        where: {
          userId: id
        }
      }) : null
    ])
    const result = await this.prismaService.client.user.delete({
      where: {
        id
      }
    })
    return result
  }
  async setRefreshToken(refreshToken: string, userId: string) {
    await this.prismaService.client.user.update({
      where: {
        id: userId
      },
      data: {
        refreshToken: refreshToken
      }
    })
    return true
  }
  async grantRole(id: GrantRole, userInfo: User) {
    return await this.prismaService.client.user.update({
      where: {
        id: id.userId
      },
      data: {
        roleId: id.roleId,
        createdBy: {
          ...userInfo
        }
      }
    })
  }
  async getPermisisonsWithID(id: string) {
    const permission = await this.prismaService.client.includePermission.findMany({
      where: {
        roleId: id
      },
      include: {
        Permission: {
          select: {
            name: true,
            path: true,
            method: true
          }
        }
      }
    })
    const result = permission.map((item) => {
      return item.Permission
    })
    return result
  }
}
