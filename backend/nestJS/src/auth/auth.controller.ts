import { Controller, Get } from "@nestjs/common";
import { AuthService } from "./auth.service";

// @todo lookup how authentication normaly works on websites

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Get()
	nothing(): any {
		return ;
	}


	// Login (?)
	loginUser() : any {
		this.authService.loginUser()

		// after success redirect the user
	}

	
	// authentication (?)
	authenticateUser() : any {
		this.authService.authenticateUser()
	}
}

// include like basic logic here and more heavy logic in service