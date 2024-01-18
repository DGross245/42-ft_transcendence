'use client';

import io, { Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';
import crypto from 'crypto';

export type WSClientType = {
	createGame: () => Promise<string>;
	joinGame: (gameId: string) => void;
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
		console.log('WSClient constructor');
		this.socketInitialized = this.socketInitializer();
	}

	private async socketInitializer(): Promise<void> {
		await fetch('/api/socket');
		this.socket = io();
	}

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

	joinGame(gameId: string): void {
		this.waitForSocket().then(() => {
			if (this.socket) {
				this.socket.emit('join-game', gameId);
			}
		});
	}

	emitMessageToGame(msg: string, topic: string, gameId: string): void {
		if (this.socket)
			this.socket!.emit('send-message-to-game', msg, topic, gameId);
	}

	addMessageListener(topic: string, gameId: string, callback: (msg: string) => void): void {
		if (this.socket)
			this.socket!.on(`message-${gameId}-${topic}`, callback);
	}

	removeMessageListener(topic: string, gameId: string): void {
		if (this.socket)
			this.socket!.removeListener(`message-${gameId}-${topic}`);
	}
}

/* -------------------------------------------------------------------------- */
/*                                    Hook                                    */
/* -------------------------------------------------------------------------- */
const useWSClient = () => {
	const [wsclient, setWsclient] = useState<WSClient | null>(null);

	useEffect(() => {
		if (window !== undefined) {
			setWsclient(new WSClient());
			console.log("created client");
		}
	},[]);

	return wsclient;
}

export default useWSClient;

// @todo add timeouts to all promises
// @todo add join any game method
