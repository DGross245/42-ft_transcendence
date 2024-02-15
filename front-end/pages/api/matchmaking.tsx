import { Game } from '@/app/tournamentManager';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { RemoteSocket } from 'Socket.IO';
import { DecorateAcknowledgementsWithMultipleResponses } from 'Socket.IO/dist/typed-events';
import crypto from 'crypto';
import { contract } from './socket';

// TODO: Add a timer or something for the case where a match is found but the opponent never joints because of quit

interface Matchmaking {
	sockets: RemoteSocket<DecorateAcknowledgementsWithMultipleResponses<DefaultEventsMap>, any>[],
	gameType: string,
}

const searchForOpponent = (sockets :Matchmaking['sockets'], length: number) => {
	const maxDiff = 0.3;

	for (let i = 0; i < sockets.length; i++) {
		let sequence = [sockets[i]];
		let maxDifference = sockets[i].data.elo * maxDiff;

		for (let j = i + 1; j < sockets.length; j++) {
			if (Math.abs(sockets[j].data.elo - sequence[sequence.length - 1].data.elo) <= maxDifference)
				sequence.push(sockets[j]);
			if (sequence.length === length)
				return (sequence);
		}
	}

	return ([]);
}

export const matchmaking = ({sockets, gameType} : Matchmaking) => {
	var players : Matchmaking['sockets'] = [];
	let maxClients = 2;

	if (gameType === "OneForAll")
		maxClients = 4;
	else if (gameType === "Qubic")
		maxClients = 3;

	if (sockets.length >= maxClients) {
		players = searchForOpponent(sockets, maxClients);

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
	if (player)
		return (player)
	else {
		console.error("Player not found in tournaments") // implement function to auto win the game for current game
		return (null);
	}
}

export const tournamentHandler = async (sockets: Matchmaking['sockets'], tournamentID: number, gameType: string ) => {
	const games = (await contract.getTournamentTree(tournamentID)) as Game[];

	// vllt ne function schreiben für sowas wie findGameTypePlayerSize oder so
	let maxClients = 2;

	if (gameType === 'OneForAll')
		maxClients = 4;
	if (gameType === 'Qubic')
		maxClients = 3;

	for (let i = 0; i < games.length; i++) {
		var players = [];
		let allPlayersAvailable = true;

		if (games[i].finished)
			continue ;
		for (let j = 0; j < maxClients; j++) {
			const player = findPlayer(sockets, games[i].player_scores[j].addr);
			players.push(player);
		}

		for(let j = 0; j < maxClients; j++) {
			if (players[j] === null)
				continue
			else if (players[j]?.data.isInGame) {
				allPlayersAvailable = false;
				break ;
			}
		}

		if (allPlayersAvailable === false)
			continue ;

		var id = crypto.randomBytes(20).toString('hex').substring(0, 7);

		for (let k = 0; k < maxClients; k++) {
			if (players[k] === null)
				continue ; // ADD mechanic to enable bot for this round (or auto win)
			else if (players[k] !== null) {
				players[k]!.data.isInGame = true;
				console.log(`Player${k}:`, players[k]?.data.walletAddress)
				players[k]!.emit('match-found', id, tournamentID, i);
			}
		}

		console.log("MATCH FOUND")
	}
}