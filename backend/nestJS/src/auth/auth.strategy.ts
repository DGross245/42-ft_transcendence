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

	async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifiedCallback ) : Promise<any> {
		console.log('done');
		if (!profile) {
			throw new UnauthorizedException();
		}
		const { name, id, email } = profile;

		console.log(name, id, email);
		return (done(null, { id, name, email }));
	}
}