import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from 'src/users/users.service'
import { comparePassword } from 'src/utils/hashPassword'

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private readonly userService: UsersService) { }
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findUserByEmail(email)
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
