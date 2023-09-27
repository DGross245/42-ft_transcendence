import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  status: string;

  @Column()
  avatar: Express.Multer.File;

  // friends?

  // is user authenticated/registered?

  // channels the user is apart of?

  // game stats?
}

// This file defines the structure and schema of the data that will be stored in a specific database table