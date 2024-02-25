import { Controller, Injectable, Post, Req, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './local-auth.guard'
import { Public } from 'src/decorators/auth.decorator'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    @UseGuards(LocalAuthGuard)
    @Public()
    @Post('login')
    async login(@Req() req) {
        return this.authService.login(req.user)
    }
}
