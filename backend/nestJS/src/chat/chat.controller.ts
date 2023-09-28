import { Controller, Delete, Get, Patch } from "@nestjs/common";
import { ChatService } from "./chat.service";

@Controller('chat')
export class ChatController {
	// maybe wrong syntax because not handling multiple chatrooms
	constructor(private readonly chatService: ChatService) {}

	@Patch()
	joinChannel() {
		this.chatService.joinChannel();
	}

	@Get()
	showAllChats() {
		this.chatService.showAllChats();
	}

	@Patch()
	inviteToChat() {
		this.chatService.showAllChats();
	}

	@Patch()
	banFormChat() {
		this.chatService.banFormChat();
	}

	@Delete()
	kickFromChat() {
		this.chatService.kickFromChat();
	}

	@Patch()
	changeChatName() {
		this.chatService.changeChatName();
	}
	
}