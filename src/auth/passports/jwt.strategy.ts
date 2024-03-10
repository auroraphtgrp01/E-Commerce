import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { RolesService } from 'src/modules/roles/roles.service'
import { UserPayload } from '../jwt-auth.guard'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private readonly roleService: RolesService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('ACCESS_TOKEN_SECRET')
    })
  }

  async validate(payload: any) {
    const permissions = await this.roleService.getAllPermission(payload.roleId)
    const userType: UserPayload = { id: payload.sub, email: payload.email, role: payload.role, permissions }
    return userType
  }
}
