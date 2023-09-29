import { Strategy } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

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

	async validate(accessToken: string, refreshToken: string, profile: any ) : Promise<any> {
		if (!profile) {
			throw new UnauthorizedException();
		}
		const { name, id, email } = profile;
		console.log(name, id, email);
	}
}