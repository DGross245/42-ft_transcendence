import * as dotenv from 'dotenv';
import * as path from 'path';
import { UserEntity } from '../user/user.entity'; // Import your entity class here

// Specify the path to the .env file based on your project structure
const envPath = path.join(__dirname, '../../../.env');

dotenv.config({ path: envPath });

export default {
  type: 'postgres' as 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [UserEntity],
  synchronize: false,
  logging: true
  };
