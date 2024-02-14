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
				players[i].emit('match-found', id);
				players[i].leave(gameType);
			}
		}
	}

	return (null)
}

const findPlayer = (sockets: Matchmaking['sockets'], address: string) => {
	const player = sockets.find(socket => socket.data.walletAddress === address);
	console.log("KEK", address);
	if (player)
		return (player)
	else
		console.error("Player not found in tournaments") // implement function to auto win the game for current game
}

export const tournamentHandler = async (sockets: Matchmaking['sockets'], tournamentID: number, gameType: string ) => {
	console.log("Check ID", tournamentID);
	for (let i = 0; 0 < sockets.length; i++) {
		console.log("Socket address", sockets[i].data.walletAddress);
	}
	console.log("All sockets", sockets);
	const games = (await contract.getTournamentTree(tournamentID)) as Game[];
	console.log(games)
	// for (let i = 0; i < games.length; i++) {
	// 	console.log('game ', i, ' players: ', games[i][0][0][0], ' ', games[i][0][1][0])
	// }
	var players = [];

	// vllt ne function schreiben für sowas wie findGameTypePlayerSize oder so
	let maxClients = 2;

	if (gameType === 'OneForAll')
		maxClients = 4;
	if (gameType === 'Qubic')
		maxClients = 3;

	console.log("GAME:", games.length);
	for (let i = 0; i < games.length; i++) {
		for (let j = 0; j < maxClients; j++) {
			const player = findPlayer(sockets, games[i].player_scores[j].addr);
			console.log("player pushed");
			players.push(player);
		}
		if (i !== 0) {
			if (games[i - 1].finished === true) {
				if (games[i].finished === false) {
					console.log("Found unfinished game");
					var id = crypto.randomBytes(20).toString('hex').substring(0, 7);

					for (let k = 0; i < maxClients; i++) {
						players[k]?.emit('match-found', id);
					}
					players = []; // reset
				}
			}
		}
		else if (i === 0) {
			console.log("Starting first game");
			console.log("player:", players)
			var id = crypto.randomBytes(20).toString('hex').substring(0, 7);

			for (let k = 0; i < maxClients; i++) {
				players[k]?.emit('match-found', id);
			}
			players = []; // reset
		}

	}
}