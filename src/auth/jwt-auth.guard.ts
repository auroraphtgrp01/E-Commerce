import { ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'
import { Observable } from 'rxjs'
import { MESSAGES_RESPONSE } from 'src/constants/messages'
import { IS_PUBLIC_KEY, IS_SKIP_PERMISSION } from 'src/decorators/auth.decorator'
export interface UserPayload {
  id: string
  email: string
  role: {
    id: string
    name: string
  }
  permissions: {
    name: string
    path: string
    method: string
  }[]
}
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass])
    if (isPublic) {
      return true
    }
    return super.canActivate(context)
  }
  handleRequest<UserPayload>(err: any, user: any, info: any, context: ExecutionContext, status?: any): UserPayload {
    if (err || !user) {
      throw err || new UnauthorizedException('This is a protected route. Please provide a valid token.')
    }
    const request: Request = context.switchToHttp().getRequest()
    const targetMethod = request.method
    const targetEndpoint = request?.route.path
    const permission = user.permissions ?? []
    const isAlowed: boolean = permission.some((permisison) => {
      const { method, path } = permisison
      if (targetEndpoint.includes(path) && targetMethod === method) return true
    })
    const isSkipPermission = this.reflector.getAllAndOverride<string>(IS_SKIP_PERMISSION, [
      context.getHandler(),
      context.getClass()
    ])
    if (!Boolean(isSkipPermission) && !isAlowed) {
      throw new ForbiddenException({ message: MESSAGES_RESPONSE.FORBIDDEN })
    }
    return user
  }
}
