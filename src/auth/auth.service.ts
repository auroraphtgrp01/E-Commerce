import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from 'src/users/schemas/user.schemas'
import { comparePassword } from 'src/utils/hashPassword'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService
  ) {}
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email: email })
    const isValid = comparePassword(password, user.password)
    if (!isValid) {
      return null
    }
    return user
  }
  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user._id
    }
    return {
      access_token: this.jwtService.sign(payload)
    }
  }
}
