import { Controller, Param, Post, Req, UseGuards, Get } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './local-auth.guard'
import { Public } from 'src/decorators/auth.decorator'
import { ResponseMessage } from 'src/decorators/customize.decorator'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  @ResponseMessage('User Login API')
  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async login(@Req() req) {
    return this.authService.login(req.user)
  }

  @ResponseMessage('User Logout API')
  @Get('logout/:id')
  async logout(@Param('id') userId: string) {
    return this.authService.logout(userId)
  }
}
