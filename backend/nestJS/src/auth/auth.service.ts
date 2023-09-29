import { Injectable } from "@nestjs/common";
import { UserRepository } from "./../user/user.repository";

@Injectable()
export class AuthService {

	constructor(private userRepository: UserRepository ) {}

	//async loginUser( username: string , password: string ) : Promise<void> {
		
	//	try {
			
	//		// redirect to 42 Auth page
	
	//		// check the callback for the data
	
	//		await this.authenticateUser( 0 );

	//	} catch ( error ) {
			
	//		// any errror = back to login page (?)
	//	}
	
	//	// check if twofact is active
	//		// redirect on fail

	//}

	//async signUp(
	//		username: string,
	//		userPwd: string,
	//		email: string,
	//		avatar: Express.Multer.File ) : Promise<void> {
		
	//	try {

	//		await this.userRepository.createNewUser( username, userPwd, email, avatar );

	//	} catch ( error ) {
	//		// throw error
	//	}
	//}

	// Adding a two factor to the acc
	AddtwoFactor() {
		// creating a qr or something like that
	}

	// remove two factor
	removeTwoFactor() {

	}

	async authenticateUser( userID: number ) : Promise<void> {
		// check if this user is already exist
			// call signin
		
		// already in database 
			// create new session

		// Session already exist
			// deny request (?) or remove old session (?) 
	}


}