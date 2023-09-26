import { Delete, Injectable, Patch, Post } from "@nestjs/common";

@Injectable()
export class UserService {

	// {repository for Users}
	
	// find user
	findUserByID( UserID: number ) {

	}

	// createUser
	@Post()
	creatNewUser() {

	}

	// delete User
	@Delete()
	deleteUser() {

	}

	// change Name
	@Patch()
	changeUsername() {

	}

	// change Avatar
	@Patch()
	changeAvatar() {

	}
	

}
