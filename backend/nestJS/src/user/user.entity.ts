import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
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
}

// This file defines the structure and schema of the data that will be stored in a specific database table