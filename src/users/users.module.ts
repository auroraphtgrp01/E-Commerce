import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Agency, AgencySchema, Customer, CustomerSchema, User, UserSchema } from './schemas/user.schemas'
import { PrismaServie } from 'src/services/prisma.service'

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersService, PrismaServie],
  exports: [UsersService]
})
export class UsersModule { }
