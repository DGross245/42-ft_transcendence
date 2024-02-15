'use client';

import io, { Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';
import crypto from 'crypto';

export type WSClientType = {
	createGame: () => Promise<string>;
	joinGame: (gameId: string, gameType: string, isBot: boolean) => Promise<number>;
	waitingForSocket: () => Promise<void>;
	emitMessageToGame: (msg: string, topic: string, gameId: string) => void;
	addMessageListener: (topic: string, gameId: string, callback: (msg: string) => void) => void;
	removeMessageListener: (topic: string, gameId: string) => void;

};

/* -------------------------------------------------------------------------- */
/*                                  WSClient                                  */
/* -------------------------------------------------------------------------- */

class WSClient {
	private socket: typeof Socket | undefined;
	private socketInitialized: Promise<void>;

	constructor() {
		this.socketInitialized = this.socketInitializer();
	}

	private async socketInitializer(): Promise<void> {
		await fetch('/api/socket');
		this.socket = io();
		return ;
	}

	// @note wait for socket initialization
	// @note first to be called
	private async waitForSocket(): Promise<void> {
		if (!this.socket) {
			await this.socketInitialized;
		}
	}

	async createGame(): Promise<string> {
		return new Promise((resolve, reject) => {
			var id = crypto.randomBytes(20).toString('hex').substring(0, 7);
			this.socket!.emit('create-game', id);
			this.socket!.on(`game-created-${id}`, (msg: string) => {
				this.socket!.removeListener(`game-created-${msg}`);
				resolve(msg);
			});
		});
	}

	async waitingForSocket(): Promise<void> {
		await this.waitForSocket();
		return ;
	}

	// @note second function to be called
	// @note see PongSocketEvents.tsx for usage
	// @note gameId can be null for cli-pong
	async joinGame(gameId: string, gameType: string, isBot: boolean): Promise<number> {
		return new Promise((resolve, reject) => {
			this.socket!.emit('join-game', gameId, gameType, isBot);
			this.socket!.on(`room-joined-${gameId}`, (numClients: number) => {
				this.socket!.removeListener(`room-joined-${gameId}`);
				resolve(numClients);
			});
		});
	}

	// @note third: emitMessageToGame to send player data
	emitMessageToGame(msg: string, topic: string, gameId: string): void {
		if (!this.socket)
			console.error("Sockets not defined, tried to send topic ", topic);
		else
			this.socket!.emit('send-message-to-game', msg, topic, gameId);
	}

	// @note third: addMessageListener to get opponent data
	addMessageListener(topic: string, gameId: string, callback: (msg: string) => void): void {
		if (!this.socket)
			console.error("Sockets not defined, tried to listen to topic ", topic);
		else
			this.socket!.on(`message-${gameId}-${topic}`, callback);
	}

	removeMessageListener(topic: string, gameId: string): void {
		if (!this.socket)
			console.error("Sockets not defined, tried to listen to topic ", topic);
		else
			this.socket!.removeListener(`message-${gameId}-${topic}`);
	}
}

// @note daniels function implementations are in PongSocketEvents
// course of things:
	// create Socket
	// joinGame
	// addMessageListener if game full
	// if full
		// emitMessageToGame with my player data
		// addMessageListener for opponent data
	// removeMessageListener?
	// gameplay
		// addMessageListener for opponent paddle data
		// emitMessageToGame with my paddle data
		// addMessageListener for opponent ball data

/* -------------------------------------------------------------------------- */
/*                                    Hook                                    */
/* -------------------------------------------------------------------------- */
const useWSClient = () => {
	const [wsclient, setWsclient] = useState<WSClient | null>(null);

	useEffect(() => {
		if (window !== undefined)
			setWsclient(new WSClient());
	},[]);

	return wsclient;
}

export default useWSClient;

// @todo add timeouts to all promises
// @todo add join any game method
