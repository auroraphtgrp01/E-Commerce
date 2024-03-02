import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common'
import { UsersService } from './users.service'
import { AddressDto, CreateUserDto, RegisterAgency, RegisterCustomer } from './dto/create-user.dto'
import { UpdateAgencyDto, UpdateUserDto } from './dto/update-user.dto'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { Public } from 'src/decorators/auth.decorator'
import { ApiTags } from '@nestjs/swagger'
import { IQueryParamsUser } from 'src/dto_customize/QueryParams.dto'
import { query } from 'express'

@ApiTags('Users')
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
  async register(@Body() registerCustomer: RegisterCustomer) {
    return await this.usersService.register(registerCustomer)
  }
  /*
   * @Method: POST
   * @Route : /users/agency
   * @Description: Create a new agency
   * @Public: false
   */
  // @UseGuards(JwtAuthGuard)
  @Post('agency')
  async registerAgency(@Body() registerAgency: RegisterAgency) {
    return await this.usersService.registerAgency(registerAgency)
  }
  /*
   * @Method: GET
   * @Route : /users
   * @Description: Get All users / customers with filter query params
   * @Public: false
   */
  @Get()
  async findAll(@Query() queryString: string) {
    return await this.usersService.findAll(queryString)
  }
  /*
    * @Method: GET
    * @Route : /users/:id
    * @Description: Get User With ID
    * @Public: false
    */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id)
  }
  /*
     * @Method: PATCH
     * @Route : /users/:id
     * @Description: Update User With ID
     * @Public: false
     */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto)
  }
  /*
   * @Method: DELETE
   * @Route : /users/:id
   * @Description: Delete User With ID
   * @Public: false
   */
  @Patch('agency/:id')
  updateAgency(@Param('id') id: string, @Body() updateUserDto: UpdateAgencyDto) {
    return this.usersService.updateAgency(id, updateUserDto, '1')
  }
  /*
    * @Method: DELETE
    * @Route : /users/:id
    * @Description: Delete User With ID
    * @Public: false
    */
  @Get('/address/:id')
  async getAddress(@Query() queryString: string, @Param('id') id: string) {
    return await this.usersService.getAddress(queryString, id)
  }
  /*
    * @Method: GET
    * @Route : /users/:id
    * @Description: Get User With ID
    * @Public: false
    */
  @Post('address')
  async createAddress(@Body() addressDto: AddressDto, @Query() queryString: string) {
    return await this.usersService.createAddress(addressDto, queryString)
  }

  @Patch('address/:id')
  async updateAddress(@Param('id') id: string, @Body() addressDto: AddressDto, @Query() queryString: string) {
    return await this.usersService.updateAddress(id, addressDto, queryString)

  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id)
  }
}
