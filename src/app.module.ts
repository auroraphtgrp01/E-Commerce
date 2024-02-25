import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { connection } from 'mongoose'
import { softDeletePlugin } from 'soft-delete-plugin-mongoose'
import { AuthModule } from './auth/auth.module'

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        connectionFactory: (connection) => {
          connection.plugin(softDeletePlugin)
          return connection
        }
      }),
      inject: [ConfigService]
    }),
    AuthModule
  ]
})
export class AppModule {}
