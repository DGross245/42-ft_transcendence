import { Body, Controller, Get, Post, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import { IntraAuthGuard } from "./auth.guard";

// @todo lookup how authentication normaly works on websites
// @todo lookup possible error handling syntaxes in NestJS

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService ) {}

	@Get()
	nothing() : string {
		return ('success auth');
	}

	@Get('login')
	@UseGuards(IntraAuthGuard)
	login() {
		return ;
	}

	@Get('redirect')
	@UseGuards(IntraAuthGuard)
	redirect(@Res() res: Response) {
		res.sendStatus(200);
		//return ('redirect');
	}

	@Get('status')
	userStatus() {

	}


	@Get('logout')
	logoutUser() {

	}
	
}

// include like basic logic here and more heavy logic in service