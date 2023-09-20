import { Controller, Post } from "@nestjs/common";

@Controller('user')
export class UserController {
	@Post('signup')
	addUser(): any {
	// here should be the data safed inside the Database
	}
}