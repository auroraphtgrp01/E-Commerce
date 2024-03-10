import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { PermissionsService } from './permissions.service'
import { CreatePermissionDto } from './dto/create-permission.dto'
import { UpdatePermissionDto } from './dto/update-permission.dto'
import { UserInfo } from 'src/decorators/customize.decorator'
import { User } from '@prisma/client'

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}
  /*
   * @Method: POST
   * @Route : /permissions
   * @Description: Create a new permission
   * @Public: False
   */
  @Post()
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    return await this.permissionsService.create(createPermissionDto)
  }
  /*
   * @Method: GET
   * @Route : /permissions
   * @Description: Get all permissions
   * @Public: False
   */
  @Get()
  async findAll(@Query() queryString: string) {
    return await this.permissionsService.findAll(queryString)
  }
  /*
   * @Method: GET
   * @Route : /permissions/:id
   * @Description: Get a permission by id
   * @Public: False
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.permissionsService.findOne(id)
  }
  /*
   * @Method: PATCH
   * @Route : /permissions/:id
   * @Description: Update a permission by id
   * @Public: False
   */
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto, @UserInfo() userInfo: User) {
    return await this.permissionsService.update(id, updatePermissionDto, userInfo)
  }
  /*
   * @Method: DELETE
   * @Route : /permissions/:id
   * @Description: Delete a permission by id
   * @Public: False
   */
  @Delete(':id')
  async remove(@Param('id') id: string, @UserInfo() userInfo: User) {
    return await this.permissionsService.remove(id, userInfo)
  }
  /*
   * @Method: PATCH
   * @Route : /permissions/restore/:id
   * @Description: Restore a permission by id
   * @Public: False
   */
  @Patch('restore/:id')
  async restore(@Param('id') id: string, @UserInfo() userInfo: User) {
    return await this.permissionsService.restore(id, userInfo)
  }
}
