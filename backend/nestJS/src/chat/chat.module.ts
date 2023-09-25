import { Module } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ChatController } from "./chat.controller";

@Module({
	imports: [],
	controllers: [ChatController],
	providers: [ChatService],
})

export class ChatModule {}