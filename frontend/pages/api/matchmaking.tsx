import crypto from 'crypto';
import { RemoteSocket } from 'Socket.IO';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { DecorateAcknowledgementsWithMultipleResponses } from 'Socket.IO/dist/typed-events';
import { Server } from "Socket.IO";

import { Game } from '@/components/hooks/useContract';
import { contract } from './socket';

interface Matchmaking {
	sockets: RemoteSocket<DecorateAcknowledgementsWithMultipleResponses<DefaultEventsMap>, any>[],
	gameType: string,
}

const searchForOpponent = async (sockets :Matchmaking['sockets'], length: number) => {
	const maxDiff = 0.42;

	for (let i = 0; i < sockets.length; i++) {
		let sequence = [sockets[i]];
		let playerOneDiffRange = (await sockets[i].data.elo) * maxDiff;

		for (let j = i + 1; j < sockets.length; j++) {
			let elodiff = Math.abs((await sockets[j].data.elo) - (await sequence[sequence.length - 1].data.elo));
			if (elodiff <= Math.abs(playerOneDiffRange)) {
				let playerTwoDiffRange = (await sockets[j].data.elo) * maxDiff;
				if (elodiff <= Math.abs(playerTwoDiffRange)) {
					sequence.push(sockets[j]);
				}
			}
			if (sequence.length === length) {
				return (sequence);
			}
		}
	}

	return ([]);
}

export const matchmaking = async ({sockets, gameType} : Matchmaking) => {
	var players : Matchmaking['sockets'] = [];
	let maxClients = 2;

	if (gameType === "OneForAll")
		maxClients = 4;
	else if (gameType === "Qubic")
		maxClients = 3;

	if (sockets.length >= maxClients) {
		players = await searchForOpponent(sockets, maxClients);

		if (players.length > 0) {
			var id = crypto.randomBytes(20).toString('hex').substring(0, 7);

			for (let i = 0; i < maxClients; i++) {
				players[i].emit('match-found', id, -1, -1);
				players[i].leave(gameType);
			}
		}
	}

	return (null)
}

const findPlayer = (sockets: Matchmaking['sockets'], address: string) => {
	const player = sockets.find(socket => socket.data.walletAddress === address);
	if (player) {
		return ({ player, address })
	}
	else {
		// player socket is not in the tournament
		return ({ player : null, address});
	}
}

const shufflePlayers = (array: any) => {

	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		let temp = array[i];
		array[i] = array[j];
		array[j] = temp
	}
	return array;
}

export const tournamentHandler = async (sockets: Matchmaking['sockets'], tournamentID: number, gameType: string, io: Server ) => {
	const games = (await contract.getTournamentTree(tournamentID)) as Game[];

	let finished = 0;
	let maxClients = 2;

	if (gameType === 'OneForAll') {
		maxClients = 4;
	}
	if (gameType === 'Qubic') {
		maxClients = 3;
	}

	for (let i = 0; i < games.length; i++) {
		var players = [];
		let allPlayersAvailable = true;
		let skipGame = false;

		if (games[i].finished) {
			finished++;
			continue ;
		}
		for (let j = 0; j < maxClients; j++) {
			const player = findPlayer(sockets, games[i].player_scores[j].addr);
			players.push(player);
		}

		for(let j = 0; j < maxClients; j++) {
			if (players[j].player === null) {
				skipGame = true;
			}
			else if (players[j].player?.data.isInGame) {
				allPlayersAvailable = false;
				break ;
			}
		}

		if (allPlayersAvailable === false) {
			continue ;
		}

		var id = crypto.randomBytes(20).toString('hex').substring(0, 7);

		var shuffledPlayers = shufflePlayers(players);

		let l = 0
		for (let k = 0; k < maxClients; k++) {
			if (shuffledPlayers[k].player !== null) {
				shuffledPlayers[k].player!.data.isInGame = true;
				shuffledPlayers[k].player!.emit('match-found', id, tournamentID, i);
				if (skipGame) {
					let address;
					if (shuffledPlayers[0].player === null)
						address = shuffledPlayers[0].address;
					else
						address = shuffledPlayers[1].address
						shuffledPlayers[k].player!.emit('Skip', address);
				}
			}
			l++
		}
	}
	if (finished === games.length) {
		let playerReady = 0;
		for (let i = 0; i < sockets.length; i++) {
			if (!sockets[i].data.isInGame) {
				playerReady++;
			}
		}
		if (playerReady === sockets.length) {
			const topic = 'tournament-finished';
			io.to(`tournament-${tournamentID}`).emit(`message-${tournamentID}-${topic}`, "");
		}
	}
}