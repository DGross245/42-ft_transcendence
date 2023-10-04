import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class IntraAuthGuard extends AuthGuard('intra42') {
	async canActivate(context: ExecutionContext) : Promise<boolean> {

		try {
			const activate = (await super.canActivate(context)) as boolean;
			const request = context.switchToHttp().getRequest();
			await super.logIn(request);
			return activate;
		  } catch (error) {
			console.error('Error in canActivate:', error);
			return false;
		  }	
	}
}