import { Controller, Post, Get, Body, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UserService } from "./user.service";

// @todo lookup what kinde path other websites use for user or other stuff like popular path syntaxes
@Controller('user')
export class UserController {
	constructor( private readonly userService: UserService) {}

	//Maybe move it to auth
	@Post('signup')
	@UseInterceptors(FileInterceptor('avatar'))
	async addUser(
		@Body() username: string,
		@Body() userPwd: string,
		@UploadedFile() avatar: Express.Multer.File,
	) {
		
	}


}