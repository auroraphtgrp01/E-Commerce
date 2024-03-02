import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { RegisterAgency, RegisterCustomer } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
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
    // const valid = this.agencyModel.findOne({ id_users: registerAgency.id_users })
    // if (valid) throw new Error('Agency already exists')
    // const result = await this.agencyModel.create({ ...registerAgency })
    // return result
  }

  async findAll(queryString: string) {
    const result = await queryDatabaseWithFilter(queryString, this.prismaService.user)
    return {
      message: 'Data fetched successfully',
      data: result
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`
  }

  remove(id: number) {
    return `This action removes a #${id} user`
  }
}
