import { Controller, Get } from "@nestjs/common";
import { GameService } from "./game.service";

@Controller ()
export class GameController {
	constructor(private readonly gameService: GameService) {}

	@Get()
	nothing(): any {
		return ;
	}
}