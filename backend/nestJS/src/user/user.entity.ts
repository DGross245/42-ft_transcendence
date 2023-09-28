import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class UserEntity {
	// default set to unique
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique : true })
	username: string;

	@Column()
	email: string;

	@Column()
	status: string;

	// should the password be saved here? (Dont forget to hash it)
  	@Column()
	password: string
// postgres has some problems with avatar
//  @Column()
//  avatar: Express.Multer.File;

  // friends?

  // is user authenticated/registered?

  // channels the user is apart of?

  // game stats?
}

// This file defines the structure and schema of the data that will be stored in a specific database table