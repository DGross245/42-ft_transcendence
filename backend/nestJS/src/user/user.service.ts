import { Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";

@Injectable()
export class UserService {

	constructor( private userRepository: UserRepository ) {}

	// moved all userRepository related stuff to user.respository

	// Profil related stuff here?

	// deleteUser (here handling notifications and stuff and calling the basic deletion method from the repository)
	// not sure if theres a better way to get the ID of the user
	async deleteUser( userID: number ) : Promise<void> {

		await this.userRepository.deleteUser( userID );

		// remove user from channels

		// remove user from friendlist

		// remove user from game stats?

	}
	
	// createUser (maybe useless due to the repository)

	private async updateUser(userID: number, newStatus: string ): Promise<void> {
		const user = await this.userRepository.findOne({ where: { id: userID }});
		user.status = newStatus;
	}
}
