import { Injectable } from "@nestjs/common";
import { User } from "./user.model";

@Injectable()
export class UserService {
	// Creating empty array of User (?)
	users: User[] = [];

	// Creates a new User and inserts it into the Database (?)
	insertUser( username: string, userPwd: string, avatar: Express.Multer.File ) {
		const newUser = new User(username, userPwd, avatar);
		this.users.push(newUser);
		// return (?)
	}

	// here should be a function that creates the users
	// and push it to the database or something like that
}

// Create Entity Classes:
// Define your database ta bles as TypeScript classes (entities). For example, if you have a User entity, you can create a User.entity.ts file with the entity definition.