import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { FileInterceptor } from "@nestjs/platform-express";

// @todo lookup how authentication normaly works on websites
// @todo lookup possible error handling syntaxes in NestJS

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService ) {}

	@Post('login')
	async loginUser(
		@Body() username: string,
		@Body() password: string
	) : Promise<void> {
		try {
			await this.authService.loginUser( username, password )

		} catch ( erro ) {

		}
	}

	@Post('signup')
	@UseInterceptors(FileInterceptor('avatar'))
	async addUser(
		@Body() username: string,
		@Body() userPwd: string,
		@Body() email: string,
		@UploadedFile() avatar: Express.Multer.File
	) {
		try {

			await this.authService.signUp( username, userPwd, email, avatar )

		} catch ( error ) {

			// return success status?

		}
	}

	
}

// include like basic logic here and more heavy logic in service