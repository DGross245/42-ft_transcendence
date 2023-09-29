import { Repository } from "typeorm";
import { UserEntity } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";


export class UserRepository extends Repository<UserEntity> {
	constructor ( @InjectRepository(UserEntity)
				  private userRepository: Repository<UserEntity>) {
					super( userRepository.target, userRepository.manager, userRepository.queryRunner);
				  }

	// Here should be function that has something to do with the repository
	// like interacting with it, read, write etc.

	// ...

	// @todo look for when I should return something

	async createNewUser( 
			username: string, 
			userPwd: string,
			email: string,
			avatar: Express.Multer.File ) : Promise<UserEntity> {
		const user = new UserEntity;
		user.id = 0; // @todo look up how do set them (ID from 42 API? Gen one?)
		user.username = username;
		user.email = email;
		user.password = userPwd;
		user.status = "ONLINE";
		return await this.userRepository.save(user);
	}

	async deleteUser( userID: number ) : Promise<void> {
		await this.userRepository.findOne({ where: {id: userID }});
		await this.userRepository.delete(userID);
	}

	// not sure if avatar is apart of that
	// updates only new user data
	async updateUser( userID: number, updateUserDto: Partial<UserEntity> ) : Promise<void> {
		const user = await this.userRepository.findOne({ where: {id: userID }});
		Object.assign(user, updateUserDto);
	}

}