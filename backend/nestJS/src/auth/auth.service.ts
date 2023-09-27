import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService {

	// Login (?)
	loginUser() : any {
		
		// redirect to 42 Auth page

		// check the callback for the data

		// check if the user already exist aka authentication
		
		// any errror = back to login page (?)

	}

	// sign up
	signUp() : any {
		// fetch info

		// save the data in the Database (for pwd hash it before saving it)

		// push it do the database
	}

	// Adding a two factor to the acc
	AddtwoFactor() {
		// creating a qr or something like that
	}

	// remove two factor
	removeTwoFactor() {

	}

	// authentication (?)
	authenticateUser() : any {
		// check if this user is already exist
			// call signin
		
		// already in database 
			// create new session

		// Session already exist
			// deny request (?) or remove old session (?) 
	}


}