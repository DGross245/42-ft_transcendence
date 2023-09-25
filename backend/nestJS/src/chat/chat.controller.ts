import { Controller, Get } from "@nestjs/common";
import { ChatService } from "./chat.service";

@Controller('chat')
export class ChatController {
	// maybe wrong syntax because not handling multiple chatrooms
	constructor(private readonly chatService: ChatService) {}

	// Join Chat/Channels (?)
	joinChannel() {
		this.chatService.joinChannel();
	}
	// See all Chats/Channels (?)
	showAllChats() {
		this.chatService.showAllChats();
	}
	// Invite to Chat/Channel {?}
	inviteToChat() {
		this.chatService.showAllChats();
	}
	// Ban from Chat/Channel 
	banFormChat() {
		this.chatService.banFormChat();
	}
	// kick from chat/channel
	kickFromChat() {
		this.chatService.kickFromChat();
	}
	// Change channel name
	changeChatName() {
		this.chatService.changeChatName();
	}
	
	@Get()
	nothing(): any {
		return ;
	}
}