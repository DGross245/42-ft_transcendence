import { Controller, Post, Get, Body, UploadedFile, UseInterceptors } from "@nestjs/common";;
import { UserService } from "./user.service";

// @todo lookup what kinde path other websites use for user or other stuff like popular path syntaxes
@Controller('user')
export class UserController {
	constructor( private readonly userService: UserService) {}


}