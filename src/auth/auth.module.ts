import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from 'src/users/schemas/user.schemas'
import { AuthController } from './auth.controller'
import { LocalStrategy } from './passports/local.strategy'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { JwtStrategy } from './passports/jwt.strategy'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema
      }
    ]),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('ACCESS_TOKEN_SECRET'),
        signOptions: { expiresIn: '50d' }
      }),
      inject: [ConfigService]
    })
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
