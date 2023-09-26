import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService {

	// Login (?)
	loginUser() : any {
		
		// Search for user ID from 42 API in repository?

		//if already registered then login

		// if not sign up
	}

	// sign up
	signUp() : any {
		// User will join using 42 API information

		// fetch the information ( not sure how this will look like )

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
		// check if this user is a 42 student

		// 
	}


}