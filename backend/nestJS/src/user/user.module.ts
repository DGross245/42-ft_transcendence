import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

// @todo lookup what dev's do in module.ts other then specifing
@Module({
	imports: [],
	controllers: [UserController],
	providers: [UserService],
})

// @todo lookup what u can do in these classes
export class UserModule {}
