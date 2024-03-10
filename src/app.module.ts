import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './modules/users/users.module'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { CustomPrismaModule, PrismaClientExceptionFilter } from 'nestjs-prisma'
import { extendedPrismaClient } from './services/prisma_customize.service'
import { APP_FILTER, HttpAdapterHost } from '@nestjs/core'
import { RolesModule } from './modules/roles/roles.module'
import { PermissionsModule } from './modules/permissions/permissions.module'

@Module({
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useFactory: ({ httpAdapter }: HttpAdapterHost) => {
        return new PrismaClientExceptionFilter(httpAdapter)
      },
      inject: [HttpAdapterHost]
    },
    AppService
  ],
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    AuthModule,
    CustomPrismaModule.forRootAsync({
      name: 'PrismaService',
      useFactory: () => {
        return extendedPrismaClient
      },
      isGlobal: true
    }),
    RolesModule,
    PermissionsModule
  ]
})
export class AppModule {}
