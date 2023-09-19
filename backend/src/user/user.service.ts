import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService {
	// here should be a function that creates the users
	// and push it to the database or something like that
}

// Create Entity Classes:
// Define your database tables as TypeScript classes (entities). For example, if you have a User entity, you can create a User.entity.ts file with the entity definition.