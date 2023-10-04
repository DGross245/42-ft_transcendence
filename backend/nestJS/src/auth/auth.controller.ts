import { Body, Controller, Get, Post, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Response } from "express";
import { IntraAuthGuard } from "./auth.guard";

// @todo lookup possible error handling syntaxes in NestJS
// @todo session support is missing

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService ) {}

	@Get()
	nothing() : string {
		return ('success auth');
	}

	// for login redirect to set password username and maybe avatar
	@Get('login')
	@UseGuards(IntraAuthGuard)
	login() {

		return ;
	}

	@Get('redirect')
	@UseGuards(IntraAuthGuard)
	redirect(@Res() res: Response) {
		res.sendStatus(200);
		// no idea what should happen here
		// maybe redirect again to home/profile page
		return ('redirect');
	}

	@Get('status')
	userStatus() {

	}


	@Get('logout')
	logoutUser() {

	}
	
}

// include like basic logic here and more heavy logic in service