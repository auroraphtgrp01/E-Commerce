import { Injectable } from '@nestjs/common'
import { CreateUserDto, RegisterAgency, RegisterCustomer } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose'
import { Agency, AgencyDocument, Customer, CustomerDocument, User, UserDocument } from './schemas/user.schemas'
import { InjectModel } from '@nestjs/mongoose'
import { hashPassword } from 'src/utils/hashPassword'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
    @InjectModel(Customer.name) private customerModel: SoftDeleteModel<CustomerDocument>,
    @InjectModel(Agency.name) private agencyModel: SoftDeleteModel<AgencyDocument>
  ) {}

  async register(registerCustomer: RegisterCustomer) {
    const hashP = await hashPassword(registerCustomer.password)
    const { _id } = await this.userModel.create({ ...registerCustomer, password: hashP })
    const valid = this.agencyModel.findOne({ id_users: _id.toString() })
    if (valid) throw new Error('Customers already exists')
    await this.customerModel.create({ id_users: _id.toString() })
    return {
      message: 'Customer registered successfully'
    }
  }

  async registerAgency(registerAgency: RegisterAgency) {
    const valid = this.agencyModel.findOne({ id_users: registerAgency.id_users })
    if (valid) throw new Error('Agency already exists')
    const result = await this.agencyModel.create({ ...registerAgency })
    return result
  }

  findAll() {}

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
