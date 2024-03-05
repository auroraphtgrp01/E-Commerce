import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { ErorrHandlerInterceptor } from './interceptors/errorHandler.interceptor'
import { JwtAuthGuard } from './auth/jwt-auth.guard'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { PrismaClientExceptionFilter } from 'nestjs-prisma'
import { TransformIntercepter } from './interceptors/transformer.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const reflector = app.get(Reflector)
  app.useGlobalInterceptors(new ErorrHandlerInterceptor())
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalGuards(new JwtAuthGuard(reflector))
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  app.useGlobalInterceptors(new TransformIntercepter(reflector));
  const config = new DocumentBuilder()
    .setTitle('E-commerce API')
    .setDescription('The E-commerce API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'JWT',
        in: 'header'
      },
      'token'
    )
    .addSecurityRequirements('token')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)
  await app.listen(3000, () => {
    console.log('Server is running on port 3000')
  })
}
bootstrap()
