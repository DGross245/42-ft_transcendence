import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import  typeOrmConfig from './TypeORM/ormconfig';
import { UserModule } from './user/user.module';
import { GameModule } from './game/game.module';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';

// The @Module decorator is used to create a module that incorporates the specified controllers, services, and other dependencies.
@Module({
  imports: [TypeOrmModule.forRootAsync({useFactory: () => typeOrmConfig,}),
			AuthModule,
			UserModule,
			GameModule,
			ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// In the app.modules.ts file, configure and organize the application's modules, services, controllers, and dependencies that the module should use.

// Avoid including a module that is already included in another module you have already imported