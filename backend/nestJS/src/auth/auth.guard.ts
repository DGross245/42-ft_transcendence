import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class IntraAuthGuard extends AuthGuard('intra42') {
	async canActivate(context: ExecutionContext) : Promise<boolean> {
		//const activate = (await super.canActivate(context)) as boolean;
		//console.log(activate);
		//const request = context.switchToHttp().getRequest();
		//console.log(request);
		//await super.logIn(request);
		////if (activate) {
		////}
		//return activate;	
		try {
			const activate = (await super.canActivate(context)) as boolean;
			console.log(activate);
			const request = context.switchToHttp().getRequest();
			console.log(request);
			await super.logIn(request);
			return activate;
		  } catch (error) {
			console.error('Error in canActivate:', error);
			return false;
		  }	
	}
}