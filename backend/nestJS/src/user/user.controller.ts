import { Controller, Post, Get, Body, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UserService } from "./user.service";

@Controller('user')
export class UserController {
	constructor( private readonly userService: UserService) {}

	@Post('signup')
	@UseInterceptors(FileInterceptor('avatar'))
	async addUser(
		@Body() username: string,
		@Body() userPwd: string,
		@UploadedFile() avatar: Express.Multer.File,
	) {
	
	}
}