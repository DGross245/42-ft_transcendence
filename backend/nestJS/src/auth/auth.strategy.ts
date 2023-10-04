import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, Profile, VerifiedCallback } from 'passport-42';

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy, 'intra42') {
	constructor() {
		super({
			clientID: process.env.INTRA_CLIENT_ID,
			clientSecret: process.env.INTRA_CLIENT_SECRET,
			callbackURL: process.env.INTRA_CALLBACK_URL,
			scope: []
		});
	}

	// need to work on the extraction of the data
	async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifiedCallback ) : Promise<any> {
		if (!profile) {
			throw new UnauthorizedException();
		}
		const { id, emails, username } = profile;

		console.log(id, username, emails); // tempo will be removed later
		return (done(null, { id, username, emails }));
	}
}