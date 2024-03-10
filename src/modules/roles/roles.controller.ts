import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { RolesService } from './roles.service'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { UserInfo } from 'src/decorators/customize.decorator'
import { User } from '@prisma/client'
import { SkipPermission } from 'src/decorators/auth.decorator'

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}
  /*
   * @Method: POST
   * @Route : /roles
   * @Description: Create a new role
   * @Public: False
   */
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto, @UserInfo() userInfo) {
    return await this.rolesService.create(createRoleDto, userInfo)
  }
  /*
   * @Method: GET
   * @Route : /roles
   * @Description: Get all roles with filter
   * @Public: False
   */
  @Get()
  async findAll(@Query() queryString: string) {
    return await this.rolesService.findAll(queryString)
  }
  /*
   * @Method: GET
   * @Route : /roles
   * @Description:   Get a role by id
   * @Public: False
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.rolesService.findOne(id)
  }
  /*
   * @Method: PATCH
   * @Route : /roles/:id
   * @Description:  Update a role by id
   * @Public: False
   */
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto, @UserInfo() userInfo: User) {
    return await this.rolesService.update(id, updateRoleDto, userInfo)
  }
  /*
   * @Method: DELETE
   * @Route : /roles/:id
   * @Description:   Get a role by id
   * @Public: False
   */
  @Delete(':id')
  async remove(@Param('id') id: string, @UserInfo() userInfo: User) {
    return await this.rolesService.remove(id, userInfo)
  }
  /*
   * @Method: PATCH
   * @Route : /roles/:id
   * @Description:  Restore a role by id
   * @Public: False
   */
  @Patch('restore/:id')
  async restore(@Param('id') id: string, @UserInfo() userInfo: User) {
    return await this.rolesService.restore(id, userInfo)
  }
  /*
   * @Method: DELETE
   * @Route : /roles/include-permission
   * @Description:  Delete a permission from a role
   * @Public: False
   */
  @SkipPermission()
  @Delete('include-permission/del')
  async deletePer(
    @Body()
    id: {
      id_permission: string
      id_role: string
    },
    @UserInfo() userInfo: User
  ) {
    return await this.rolesService.deletePer(id, userInfo)
  }
  /*
   * @Method: DELETE
   * @Route : /roles/include-permission
   * @Description:  Delete a permission from a role
   * @Public: False
   */
  @Post('include-permission/grant')
  async grantPermission(
    @Body()
    id: {
      id_permission: string
      id_role: string
    },
    @UserInfo() userInfo: User
  ) {
    return await this.rolesService.grantPermission(id, userInfo)
  }
}
