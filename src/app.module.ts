import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { CustomPrismaModule, PrismaClientExceptionFilter, PrismaModule } from 'nestjs-prisma'
import { extendedPrismaClient } from './services/prisma_customize.service'
import { APP_FILTER, HttpAdapterHost } from '@nestjs/core'

@Module({
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useFactory: ({ httpAdapter }: HttpAdapterHost) => {
        return new PrismaClientExceptionFilter(httpAdapter);
      },
      inject: [HttpAdapterHost],
    }, AppService,
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
        return extendedPrismaClient;
      },
      isGlobal: true,
    })
  ]
})
export class AppModule { }
