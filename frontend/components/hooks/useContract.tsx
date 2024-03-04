"use client";

import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers5/react'
import scoresAbi from '../../public/tournamentManager_abi.json';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';

export const contract_address = '0x8e627ECD303Ff1735948C62D3754D364D82583ED'

/* -------------------------------------------------------------------------- */
/*                                  Interface                                 */
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

	const callContract = useCallback(async (functionName: string, args: any[] = []) => {
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
	},[tmContract]);

	// creates a new tournament and adds calling address as master
	// the caller HAS to join separately as a player if he wants to participate
	const createTournament = useCallback(async (duration_in_blocks: number) => {
		await callContract('createTournament', [duration_in_blocks]);
	},[callContract]);

	// starts a previously created tournament and creates game tree
	// players cannot join after this
	const startTournament = useCallback(async (tournament_id: number) => {
		await callContract('startTournament', [tournament_id]);
	},[callContract]);

	// sets name and color of the player (player = calling address)
	// color is a hex string, e.g. '0xFF0000'
	// this "player profile" will be stored permanently accross all games and tournaments
	const setNameAndColor = useCallback(async (name: string, color: string) => {
		return (await callContract('setNameAndColor', [name, color]));
	},[callContract]);

	// calling address/player joins the specified tournament
	const joinTournament = useCallback(async (tournament_id: number) => {
		await callContract('joinTournament', [tournament_id]);
	},[callContract]);

	// tournament has to have at least 2 players for this to work
	const submitGameResultTournament = useCallback(async (tournament_id: number, game_id: number, scores: PlayerScore[]) => {
		// const scores: PlayerScore[] = [
		// 	// addresses HAVE to differ from each other, otherwise second score submission will overwrite the first one
		// 	{ player: '0x0000000000', score: 1 },
		// 	{ player: '0x4242424242', score: 2 },
		// ]
		await callContract('submitGameResultTournament', [tournament_id, game_id, scores]);
	},[callContract]);

	// ranked games cannot be created beforehand, they will automatically be created upon submission of scores
	// therefore, there are no error checks and arbitrary player_score arrays can be submitted
	const submitGameResultRanked = useCallback(async (scores: PlayerScore[]) => {
		// const scores: PlayerScore[] = [
		// 	// addresses HAVE to differ from each other, otherwise second score submission will overwrite the first one
		// 	{ player: '0x0000000000', score: 1 },
		// 	{ player: '0x4242424242', score: 2 },
		// ]
		await callContract('submitGameResultRanked', [scores]);
	},[callContract]);

	// returns array of all available tournaments
	const getTournaments = useCallback(async () => {
		return (await callContract('getTournaments')) as Tournament[];
	},[callContract]);

	// returns a single tournament
	const getTournament = useCallback(async (tournament_id: number) => {
		return (await callContract('getTournament', [tournament_id])) as Tournament;
	},[callContract]);

	// returns tournament tree (array of games) of a single tournament
	const getTournamentTree = useCallback(async (tournament_id: number) => {
		return (await callContract('getTournamentTree', [tournament_id])) as Game[];
	},[callContract]);

	// returns information about a player
	// match history not included, only name and color
	const getPlayer = useCallback(async (address: string) => {
		return (await callContract('getPlayer', [address])) as Player;
	},[callContract])

	// returns array of all ranked games
	// this can be used to display a leaderboard, as well as match history of a player
	const getRankedGames = useCallback(async () => {
		return (await callContract('getRankedGames')) as Game[];
	},[callContract]);

	// returns number of games played divided by accumulated score across all games
	const getPlayerRankedElo = useCallback(async (address: string) => {
		return (await callContract('getPlayerRankedElo', [address])) as number;
	},[callContract]);

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
