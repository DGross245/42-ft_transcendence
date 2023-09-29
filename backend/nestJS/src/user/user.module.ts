import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserRepository } from "./user.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";

// @todo lookup what dev's do in module.ts other then specifing
@Module({
	imports: [TypeOrmModule.forFeature([UserEntity])],
	controllers: [UserController],
	providers: [UserService,UserRepository],
	exports: [UserService, UserRepository]
})

// @todo lookup what u can do in these classes
export class UserModule {}
