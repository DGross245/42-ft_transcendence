"use client";

import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers5/react'
import scoresAbi from '../../public/tournamentManager_abi.json';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from '@/app/i18n';
import { toast } from 'react-toastify';
import { useSound } from './Sound';
import { ethers } from 'ethers';

export const _address = '0x4982051409D3F7f1C37d9f1e544EF6c6e8557148'

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
	game_type: string,
	duration_in_blocks: number
	start_block: number
	end_block: number
	players: string[]
	games: Game[]
}

/* -------------------------------------------------------------------------- */
/*                                 Hook                               */
/* -------------------------------------------------------------------------- */
function use() {
	const [tm, setTm] = useState<ethers. | null>(null);
	const { address, chainId, isConnected } = useWeb3ModalAccount();
	const { walletProvider } = useWeb3ModalProvider();
	const { t } = useTranslation("toasts");
	const playSound =  useSound();

	useEffect(() => {
		if (isConnected && walletProvider) {
			const provider = new ethers.providers.Web3Provider(walletProvider);
			const signer = provider.getSigner();
			const tm = new ethers.(_address, scoresAbi, signer);
			setTm(tm);
		}
	}, [isConnected, walletProvider]);

	const call = useCallback(async (functionName: string, args: any[] = []) => {
		try {
			const result = await tm?.[functionName](...args);
			if (result && typeof result.wait !== "undefined") {
				playSound("pay");
				toast.info(t("toast.minted"))
				const receipt = await result.wait();
				// const event = receipt.events.find(event => event.event === events)
				// const value = event.args.value;
				// return (value);
				return receipt;
			}
			return result;
		} catch (error) {
			if ((error as any)?.code == "ACTION_REJECTED") {
				toast.warning(t("toast.rejecteduser"));
			} else {
				toast.error(t("toast.errorcall"));
			}
		}
		return null;
	},[tm, playSound, t]);

	// creates a new tournament and adds calling address as master
	// the caller HAS to join separately as a player if he wants to participate
	const createTournament = useCallback(async (duration_in_blocks: number, gameType: string) => {
		return (await call('createTournament', [duration_in_blocks, gameType]));
	},[call]);

	// starts a previously created tournament and creates game tree
	// players cannot join after this
	const startTournament = useCallback(async (tournament_id: number) => {
		return (await call('startTournament', [tournament_id]));
	},[call]);

	// sets name and color of the player (player = calling address)
	// color is a hex string, e.g. '0xFF0000'
	// this "player profile" will be stored permanently accross all games and tournaments
	const setNameAndColor = useCallback(async (name: string, color: string) => {
		return (await call('setNameAndColor', [name, color]));
	},[call]);

	// calling address/player joins the specified tournament
	const joinTournament = useCallback(async (tournament_id: number) => {
		return (await call('joinTournament', [tournament_id]));
	},[call]);

	// tournament has to have at least 2 players for this to work
	const submitGameResultTournament = useCallback(async (tournament_id: number, game_id: number, scores: PlayerScore[]) => {
		// const scores: PlayerScore[] = [
		// 	// addresses HAVE to differ from each other, otherwise second score submission will overwrite the first one
		// 	{ player: '0x0000000000', score: 1 },
		// 	{ player: '0x4242424242', score: 2 },
		// ]
		return (await call('submitGameResultTournament', [tournament_id, game_id, scores]));
	},[call]);

	// ranked games cannot be created beforehand, they will automatically be created upon submission of scores
	// therefore, there are no error checks and arbitrary player_score arrays can be submitted
	const submitGameResultRanked = useCallback(async (scores: PlayerScore[]) => {
		// const scores: PlayerScore[] = [
		// 	// addresses HAVE to differ from each other, otherwise second score submission will overwrite the first one
		// 	{ player: '0x0000000000', score: 1 },
		// 	{ player: '0x4242424242', score: 2 },
		// ]
		return (await call('submitGameResultRanked', [scores]));
	},[call]);

	// returns array of all available tournaments
	const getTournaments = useCallback(async () => {
		return (await call('getTournaments')) as Tournament[];
	},[call]);

	// returns a single tournament
	const getTournament = useCallback(async (tournament_id: number) => {
		return (await call('getTournament', [tournament_id])) as Tournament;
	},[call]);

	// returns tournament tree (array of games) of a single tournament
	const getTournamentTree = useCallback(async (tournament_id: number) => {
		return (await call('getTournamentTree', [tournament_id])) as Game[];
	},[call]);

	// returns information about a player
	// match history not included, only name and color
	const getPlayer = useCallback(async (address: string) => {
		return (await call('getPlayer', [address])) as Player;
	},[call])

	// returns array of all ranked games
	// this can be used to display a leaderboard, as well as match history of a player
	const getRankedGames = useCallback(async () => {
		return (await call('getRankedGames')) as Game[];
	},[call]);

	// returns number of games played divided by accumulated score across all games
	const getPlayerRankedElo = useCallback(async (address: string) => {
		return (await call('getPlayerRankedElo', [address])) as number;
	},[call]);

	return {
		tm,
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

export default use;
