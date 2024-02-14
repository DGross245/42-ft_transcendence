'use client';

import io, { Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';
import crypto from 'crypto';
import { contract } from '@/pages/api/socket';

export type WSClientType = {
	createGame: () => Promise<string>;
	waitingRoom: () => Promise<string>;
	joinGame: (gameId: string, gameType: string, isBot: boolean) => Promise<number>;
	waitingForSocket: () => Promise<void>;
	emitMessageToGame: (msg: string, topic: string, gameId: string) => void;
	addMessageListener: (topic: string, gameId: string, callback: (msg: string) => void) => void;
	removeMessageListener: (topic: string, gameId: string) => void;
	joinQueue: (game: string) => void;
	sendAddress: (address: `0x${string}` | undefined) => void;
	joinTournament: (tournamentID: number) => void;
	requestTournament: (tournamentID: number, gameType: string) => void;
	updateStatus: (isInGame: boolean) => void;
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

	updateStatus(isInGame: boolean) {
		this.socket!.emit('Update-Status');
	}
	joinTournament(tournamentID: number) {
		this.socket!.emit('join-tournament', tournamentID);
	}
	requestTournament(tournamentID: number, gameType: string) {
		this.socket!.emit('tournament', tournamentID, gameType);
	}

	joinQueue(game: string) {
		this.socket!.emit('join-queue', game);
	}

	sendAddress(address: `0x${string}` | undefined) {
		this.socket!.emit('WalletAdress', address);
	}

	async waitingForSocket(): Promise<void> {
		await this.waitForSocket();
		return ;
	}

	async joinGame(gameId: string, gameType: string, isBot: boolean): Promise<number> {
		return new Promise((resolve, reject) => {
			this.socket!.emit('join-game', gameId, gameType, isBot);
			this.socket!.on(`room-joined-${gameId}`, (numClients: number) => {
				this.socket!.removeListener(`room-joined-${gameId}`);
				resolve(numClients);
			});
		});
	}

	async waitingRoom(): Promise<string> {
		return new Promise((resolve, reject) => {
			this.socket!.on('match-found', (gameID: string) => {
				this.socket!.removeListener('match-found');
				resolve(gameID);
			});
		});
	}

	emitMessageToGame(msg: string, topic: string, gameId: string): void {
		if (!this.socket)
			console.error("Sockets not defined, tried to send topic ", topic);
		else
			this.socket!.emit('send-message-to-game', msg, topic, gameId);
	}

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
