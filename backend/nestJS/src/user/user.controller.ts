import { Controller, Post, Get, Body, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UserService } from "./user.service";

@Controller('user')
export class UserController {
	constructor( private readonly userService: UserService) {}

	@Get()
	getLogin(): any {
		// Load login side (?)
		return ;
	}

	@Post('signup')
	@UseInterceptors(FileInterceptor('avatar'))
	async addUser(
		@Body() username: string,
		@Body() userPwd: string,
		@UploadedFile() avatar: Express.Multer.File,
	) {
		this.userService.insertUser(username, userPwd, avatar );
	}
}