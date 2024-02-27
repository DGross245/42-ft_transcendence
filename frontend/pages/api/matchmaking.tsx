import { Game } from '@/components/hooks/useContract';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { RemoteSocket } from 'Socket.IO';
import { DecorateAcknowledgementsWithMultipleResponses } from 'Socket.IO/dist/typed-events';
import crypto from 'crypto';
import { contract } from './socket';

interface Matchmaking {
	sockets: RemoteSocket<DecorateAcknowledgementsWithMultipleResponses<DefaultEventsMap>, any>[],
	gameType: string,
}

const searchForOpponent = async (sockets :Matchmaking['sockets'], length: number) => {
	const maxDiff = 0.4;

	for (let i = 0; i < sockets.length; i++) {
		let sequence = [sockets[i]];
		let maxDifference = (await sockets[i].data.elo) * maxDiff;

		for (let j = i + 1; j < sockets.length; j++) {
			if (Math.abs((await sockets[j].data.elo) - (await sequence[sequence.length - 1].data.elo)) <= maxDifference) {
				sequence.push(sockets[j]);
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
		let skipGame = false;

		if (games[i].finished)
			continue ;
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

		if (allPlayersAvailable === false)
			continue ;

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
}