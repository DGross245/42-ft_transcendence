import { Controller, Get } from "@nestjs/common";
import { AuthService } from "./auth.service";

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
	}

	
	// authentication (?)
	authenticateUser() : any {
		this.authService.authenticateUser()
	}
}