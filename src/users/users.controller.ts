import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common'
import { UsersService } from './users.service'
import { AddressDto, CreateUserDto, GrantRole, RegisterAgency, RegisterCustomer } from './dto/create-user.dto'
import { UpdateAgencyDto, UpdateUserDto } from './dto/update-user.dto'
import { Public } from 'src/decorators/auth.decorator'
import { ApiTags } from '@nestjs/swagger'
import { ResponseMessage, UserInfo } from 'src/decorators/customize.decorator'
import { User } from '@prisma/client'
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
  @ResponseMessage('Create a new users / customers')
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
  @ResponseMessage('Create a new agency')
  @Post('agency')
  async registerAgency(@Body() registerAgency: RegisterAgency) {
    return await this.usersService.registerAgency(registerAgency)
  }
  /*
    * @Method: POST
    * @Route : /address
    * @Description: Create address of users with Id & filter query params ( Agency || Customer ) 
    * @Public: false
    */
  @ResponseMessage('Create all address of users with Id & filter query params ( Agency || Customer )')
  @Post('address')
  async createAddress(@Body() addressDto: AddressDto, @Query() queryString: string) {
    return await this.usersService.createAddress(addressDto, queryString)
  }
  /*
   * @Method: GET
   * @Route : /users
   * @Description: Get All users / customers with filter query params
   * @Public: false
   */
  @ResponseMessage('Get User With Condition !')
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
  @ResponseMessage('Get User With ID')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id)
  }
  /*
    * @Method: GET
    * @Route : /address/:id
    * @Description: Get address of users with Id & filter query params ( Agency || Customer )
    * @Public: false
    */
  @ResponseMessage('Get address of users with Id & filter query params ( Agency || Customer )')
  @Get('/address/:id')
  async getAddress(@Query() queryString: string, @Param('id') id: string) {
    return await this.usersService.getAddress(queryString, id)
  }
  /*
     * @Method: PATCH
     * @Route : /users/:id
     * @Description: Update User With ID
     * @Public: false
     */
  @ResponseMessage('Update User With ID')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto)
  }
  /*
   * @Method: PATCH
   * @Route : /agency/:id
   * @Description: Update Agency With ID
   * @Public: false
   */
  @ResponseMessage('Update Agency With ID')
  @Patch('agency/:id')
  updateAgency(@Param('id') id: string, @Body() updateUserDto: UpdateAgencyDto) {
    return this.usersService.updateAgency(id, updateUserDto, '1')
  }
  /*
    * @Method: PATCH
    * @Route : /address/:id
    * @Description: Update address of users with Id & filter query params ( Agency || Customer )
    * @Public: false
    */
  @ResponseMessage('Update address of users with Id & filter query params ( Agency || Customer )')
  @Patch('address/:id')
  async updateAddress(@Param('id') id: string, @Body() addressDto: AddressDto, @Query() queryString: string) {
    return await this.usersService.updateAddress(id, addressDto, queryString)
  }
  /*
      * @Method: DELETE
      * @Route : /:id
      * @Description: Soft Delete User With ID include Agency & Customer
      * @Public: false
      */
  @ResponseMessage('Soft Delete User With ID include Agency & Customer')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usersService.removeUser(id)
  }
  /*
      * @Method: POST
      * @Route : /grant-role/:id
      * @Description: Grant Role to User
      * @Public: false
      */
  @Post('grant-role')
  async grantRole(@Body() grandRole: GrantRole, @UserInfo() userInfo: User) {
    console.log(userInfo);

    return await this.usersService.grantRole(grandRole, userInfo)
  }
}
