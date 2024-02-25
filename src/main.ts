import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { ErorrHandlerInterceptor } from './core/errorHandler.interceptor'
import { JwtAuthGuard } from './auth/jwt-auth.guard'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const reflector = app.get(Reflector)
  app.useGlobalInterceptors(new ErorrHandlerInterceptor())
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalGuards(new JwtAuthGuard(reflector))
  await app.listen(3000, () => {
    console.log('Server is running on port 3000')
  })
}
bootstrap()
