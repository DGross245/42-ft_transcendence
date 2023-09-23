import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';

// loads .env
// (check if this is save and good practise)
// config();

async function bootstrap() {
  // NestFactory is used to create an instance of the NestJS application, which typically starts with the AppModule.
  // await just waits until the instance is created.
  const app = await NestFactory.create(AppModule);
  await app.listen(8000, '0.0.0.0');
}
bootstrap();
// The main.ts file serves as the entry point of the application, where you bootstrap the NestJS application and start the server.

// www.getpostman.com for API requests

// When multiple decorators of the same type are applied to a method, such as '@Get()', only the first one encountered will be executed.
