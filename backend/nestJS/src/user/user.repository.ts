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

	// findOneByID or somefunction to find user

	// ...
}