import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto, RegisterAgency, RegisterCustomer } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { Public } from 'src/decorators/auth.decorator'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
  /*
   * @Method: POST
   * @Route : /users
   * @Description: Create a new users / customers
   * @Public: true
   */
  @Public()
  @Post()
  register(@Body() registerCustomer: RegisterCustomer) {
    return this.usersService.register(registerCustomer)
  }
  /*
   * @Method: POST
   * @Route : /users/agency
   * @Description: Create a new agency
   * @Public: false
   */
  // @UseGuards(JwtAuthGuard)
  @Post('agency')
  registerAgency(@Body() registerAgency: RegisterAgency) {
    return this.usersService.registerAgency(registerAgency)
  }

  @Get()
  findAll() {
    return this.usersService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id)
  }
}
