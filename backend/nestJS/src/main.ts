import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';

// loads .env
// (check if this is save and good practise)
 config();

async function bootstrap() {
  // NestFactory is used to create an instance of the NestJS application, which typically starts with the AppModule.
  // await just waits until the instance is created.
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.BACKEND_PORT);
  console.log('NestJS application is running on port 3000');

}
bootstrap();
// The main.ts file serves as the entry point of the application, where you bootstrap the NestJS application and start the server.

// www.getpostman.com for API requests

// When multiple decorators of the same type are applied to a method, such as '@Get()', only the first one encountered will be executed.

// 1. Login and Registration
// 2. Websockets for multiple Users
// 3. Chat
// 4. Game
// 5. User profile adding friends and stuff
// 6. rest