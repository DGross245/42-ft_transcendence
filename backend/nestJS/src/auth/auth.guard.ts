import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class IntraAuthGuard extends AuthGuard('intra42') {
	async canActivate(context: ExecutionContext) : Promise<boolean> {
		const activate = (await super.canActivate(context)) as boolean;
		console.log(activate);
		if (activate) {
			const request = context.switchToHttp().getRequest();
			console.log(request);
			await super.logIn(request);
		}
		return activate;		
	}
}