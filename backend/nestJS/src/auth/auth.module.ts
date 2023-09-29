import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "./../user/user.module";
import { IntraStrategy } from "./auth.strategy";
import { PassportModule } from "@nestjs/passport";

@Module({
	imports: [UserModule, PassportModule.register({})],
	controllers: [AuthController],
	providers: [AuthService, IntraStrategy],
})

export class AuthModule {}

// AuthModule is for registration (signup) and authorization of users
