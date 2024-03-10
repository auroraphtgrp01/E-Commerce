import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { RolesService } from 'src/modules/roles/roles.service'
import { UsersService } from 'src/modules/users/users.service'
import { comparePassword } from 'src/utils/hashPassword'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private configService: ConfigService,
    private readonly roleService: RolesService
  ) {}
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findUserByEmail(email)
    const isValid = comparePassword(password, user.password)
    if (!isValid) {
      return null
    }
    return user
  }
  async login(user: any) {
    const role = await this.roleService.findOne(user.roleId)
    const payload = {
      email: user.email,
      sub: user.id,
      role: {
        id: role.id,
        name: role.name
      }
    }
    const refreshToken = this.jwtService.sign(
      {},
      {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRE')
      }
    )
    await this.userService.setRefreshToken(refreshToken, user.id)
    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRE')
      })
    }
  }
  async logout(userId: string) {
    await this.userService.setRefreshToken(null, userId)
    return {
      message: 'User logout successfully'
    }
  }
}
