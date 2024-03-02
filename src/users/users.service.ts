import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { AddressDto, RegisterAgency, RegisterCustomer } from './dto/create-user.dto'
import { UpdateAgencyDto, UpdateUserDto } from './dto/update-user.dto'
import { hashPassword } from 'src/utils/hashPassword'
import { PrismaServie } from 'src/services/prisma.service'
import { IQueryParamsUser } from 'src/dto_customize/QueryParams.dto'
import aqp from 'api-query-params'
import { PopulateOptions } from 'mongoose'
import { queryDatabaseWithFilter } from 'src/utils/queryDatabase'

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaServie) { }

  async register(registerCustomer: RegisterCustomer) {
    const isExist = await this.prismaService.user.findUnique({
      where: {
        email: registerCustomer.email
      }
    })
    if (isExist) throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST)
    const hashP = await hashPassword(registerCustomer.password)
    const result = await this.prismaService.user.create({
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
    const isValid = await this.prismaService.customer.findUnique({
      where: {
        userId: result.id
      }
    })
    if (isValid) throw new HttpException('Customer already exists', HttpStatus.BAD_REQUEST)
    await this.prismaService.customer.create({
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
    const isValid = await this.prismaService.user.findUnique({
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
    const result = await this.prismaService.agency.create({
      data: {
        ...registerAgency as any
      }
    })
    await this.prismaService.address.create({
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
    const result = await queryDatabaseWithFilter(queryString, this.prismaService.user)
    return {
      message: 'Data fetched successfully',
      data: result
    }
  }

  async findOne(id: string) {
    const result = await this.prismaService.user.findUnique({
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
      data: (delete result.password, result)
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    delete updateUserDto.password
    const user = await this.prismaService.user.update({
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
    // const user = await this.prismaService.user.findUnique({
    //   where: {
    //     id: userId
    //   }
    // })
    // if (!user) throw new HttpException('User not found', HttpStatus.UNAUTHORIZED)
    const result = await this.prismaService.agency.update({
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
  remove(id: number) {
    return `This action removes a #${id} user`
  }

  async findUserByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
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
      result = await this.prismaService.address.findMany({
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
      result = await this.prismaService.address.findMany({
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
      const result = await this.prismaService.address.create({
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
      const result = await this.prismaService.address.create({
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
      const result = await this.prismaService.address.updateMany({
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
      const result = await this.prismaService.address.updateMany({
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
  }
}
