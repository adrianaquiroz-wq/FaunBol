import 'dotenv/config';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('FaunBol API – Endangered Bolivian Wildlife')
    .setDescription(
      'Educational REST API about endangered Bolivian wildlife. ' +
        'Conservation statuses follow the IUCN Red List (UICN) and the ' +
        'Bolivian Red Book (Libro Rojo de la Fauna Silvestre de Vertebrados de Bolivia, MMAyA). ' +
        'For education and conservation only: distribution data is kept general on purpose.',
    )
    .setVersion('1.0')
    .build();
  SwaggerModule.setup(
    'api/docs',
    app,
    SwaggerModule.createDocument(app, swaggerConfig),
  );

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
  Logger.log(`API:     http://localhost:${port}/api`, 'Bootstrap');
  Logger.log(`Swagger: http://localhost:${port}/api/docs`, 'Bootstrap');
}
await bootstrap();
