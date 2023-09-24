// User information would be created and set.
export class User {
	constructor(
		public username: string, 
		private userPwd: string, 
		public avatar: Express.Multer.File ) {}
}

// Mabye need a Avatar/ Picture validation