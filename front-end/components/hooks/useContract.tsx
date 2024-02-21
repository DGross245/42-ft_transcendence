"use client";

import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers5/react'
import scoresAbi from '../../public/tournamentManager_abi.json';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';

export const contract_address = '0x78eB50eE209a4DEE099Acc422c650825FD5D1771'

/* -------------------------------------------------------------------------- */
/*                               Data Structures                              */
/* -------------------------------------------------------------------------- */
interface Player {
	addr: string
	name: string
	color: string
}
export interface PlayerScore {
	addr: string
	score: number
}
export interface Game {
	player_scores: PlayerScore[]
	finished: boolean
}
export interface Tournament {
	master: string
	duration_in_blocks: number
	start_block: number
	end_block: number
	players: string[]
	games: Game[]
}

/* -------------------------------------------------------------------------- */
/*                                Contract Hook                               */
/* -------------------------------------------------------------------------- */
function useContract() {
	const [tmContract, setTmContract] = useState<ethers.Contract | null>(null);
	const { address, chainId, isConnected } = useWeb3ModalAccount();
	const { walletProvider } = useWeb3ModalProvider();

	useEffect(() => {
		if (isConnected && walletProvider) {
			const provider = new ethers.providers.Web3Provider(walletProvider);
			const signer = provider.getSigner();
			const tmContract = new ethers.Contract(contract_address, scoresAbi, signer);
			setTmContract(tmContract);
		}
	}, [isConnected, walletProvider]);

	async function callContract(functionName: string, args: any[] = []) {
		try {
			const result = await tmContract?.[functionName](...args);
			if (typeof result.wait !== "undefined") {
				result.wait();
			}
			return result;
		} catch (error) {
			if ((error as any)?.code == "ACTION_REJECTED") {
				toast.warning("Transaction rejected by user");
			} else {
				toast.error("Error calling contract function");
			}
		}
		return null;
	}

	// creates a new tournament and adds calling address as master
	// the caller HAS to join separately as a player if he wants to participate
	async function createTournament(duration_in_blocks: number) {
		await callContract('createTournament', [duration_in_blocks]);
	}

	// starts a previously created tournament and creates game tree
	// players cannot join after this
	async function startTournament(tournament_id: number){
		await callContract('startTournament', [tournament_id]);
	}

	// sets name and color of the player (player = calling address)
	// color is a hex string, e.g. '0xFF0000'
	// this "player profile" will be stored permanently accross all games and tournaments
	async function setNameAndColor(name: string, color: string) {
		await callContract('setNameAndColor', [name, color]);
	}

	// calling address/player joins the specified tournament
	async function joinTournament(tournament_id: number) {
		await callContract('joinTournament', [tournament_id]);
	}

	// tournament has to have at least 2 players for this to work
	async function submitGameResultTournament(tournament_id: number, game_id: number, scores: PlayerScore[]) {
		// const scores: PlayerScore[] = [
		// 	// addresses HAVE to differ from each other, otherwise second score submission will overwrite the first one
		// 	{ player: '0x0000000000', score: 1 },
		// 	{ player: '0x4242424242', score: 2 },
		// ]
		await callContract('submitGameResultTournament', [tournament_id, game_id, scores]);
	}

	// ranked games cannot be created beforehand, they will automatically be created upon submission of scores
	// therefore, there are no error checks and arbitrary player_score arrays can be submitted
	async function submitGameResultRanked(scores: PlayerScore[]) {
		// const scores: PlayerScore[] = [
		// 	// addresses HAVE to differ from each other, otherwise second score submission will overwrite the first one
		// 	{ player: '0x0000000000', score: 1 },
		// 	{ player: '0x4242424242', score: 2 },
		// ]
		await callContract('submitGameResultRanked', [scores]);
	}

	// returns array of all available tournaments
	async function getTournaments() {
		return (await callContract('getTournaments')) as Tournament[];
	}

	// returns a single tournament
	async function getTournament(tournament_id: number) {
		return (await callContract('getTournament', [tournament_id])) as Tournament;
	}

	// returns tournament tree (array of games) of a single tournament
	async function getTournamentTree(tournament_id: number) {
		return (await callContract('getTournamentTree', [tournament_id])) as Game[];
	}

	// returns information about a player
	// match history not included, only name and color
	async function getPlayer(address: string) {
		return (await callContract('getPlayer', [address])) as Player;
	}

	// returns array of all ranked games
	// this can be used to display a leaderboard, as well as match history of a player
	async function getRankedGames() {
		return (await callContract('getRankedGames')) as Game[];
	}

	// returns number of games played divided by accumulated score across all games
	async function getPlayerRankedElo() {
		return (await callContract('getPlayerRankedElo')) as number;
	}

	return {
		address,
		createTournament,
		startTournament,
		getPlayerRankedElo,
		getRankedGames,
		getPlayer,
		getTournamentTree,
		getTournament,
		getTournaments,
		submitGameResultRanked,
		submitGameResultTournament,
		joinTournament,
		setNameAndColor,
	}
};

export default useContract;
