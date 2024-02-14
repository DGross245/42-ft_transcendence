"use client"

import { ethers } from 'ethers';
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers5/react'
import scoresAbi from '../public/tournamentManager_abi.json';
import erc20Abi from '../public/erc20_abi.json';

const contract_address = '0xBD7862926360b8535D098276ccb5Be40d2C01202'

function Scores() {
	const { address, chainId, isConnected } = useWeb3ModalAccount()
	const { walletProvider } = useWeb3ModalProvider()

	async function prepareContract() {
		if (!isConnected) throw Error("User disconnected")
		if (!walletProvider) throw Error("No wallet provider found")
		const provider =  new ethers.providers.Web3Provider(walletProvider)
		const signer = provider.getSigner()
		const tmContract = new ethers.Contract(contract_address, scoresAbi, signer)
		return tmContract
	}

	// data structures for tournament manager contract
	interface Player {
		address: string
		name: string
		color: string
	}
	interface PlayerScore {
		player: string
		score: number
	}
	interface Game {
		player_scores: PlayerScore[]
		finished: boolean
	}
	interface Tournament {
		master: string
		duration_in_blocks: number
		start_block: number
		end_block: number
		players: Player[]
		games: Game[]
	}

	// creates a new tournament and adds calling address as master
	// the caller HAS to join separately as a player if he wants to participate
	async function createTournament(duration_in_blocks: number) {
		const tmContract = await prepareContract();
		const result = await tmContract.createTournament(duration_in_blocks);
		const res = await result.wait();
		console.log(res.events.find((event: any) => event.event === 'TournamentCreated'));
	}

	// starts a previously created tournament and creates game tree
	// players cannot join after this
	async function startTournament(tournament_id: number){
		const tmContract = await prepareContract()
		await tmContract.startTournament(tournament_id)
	}

	// sets name and color of the player (player = calling address)
	// color is a hex string, e.g. '0xFF0000'
	// this "player profile" will be stored permanently accross all games and tournaments
	async function setNameAndColor(name: string, color: string) {
		const tmContract = await prepareContract()
		await tmContract.setNameAndColor(name, color)
	}

	// calling address/player joins the specified tournament
	async function joinTournament(tournament_id: number) {
		const tmContract = await prepareContract()
		await tmContract.joinTournament(tournament_id)
	}

	// tournament has to have at least 2 players for this to work
	async function submitGameResultTournament(tournament_id: number, game_id: number, scores: PlayerScore[]) {
		const tmContract = await prepareContract()
		// const scores: PlayerScore[] = [
		// 	// addresses HAVE to differ from each other, otherwise second score submission will overwrite the first one
		// 	{ player: '0x0000000000', score: 1 },
		// 	{ player: '0x4242424242', score: 2 },
		// ]
		await tmContract.submitGameResultTournament(tournament_id, game_id, scores)
	}

	// ranked games cannot be created beforehand, they will automatically be created upon submission of scores
	// therefore, there are no error checks and arbitrary player_score arrays can be submitted
	async function submitGameResultRanked(scores: PlayerScore[]) {
		const tmContract = await prepareContract()
		// const scores: PlayerScore[] = [
		// 	// addresses HAVE to differ from each other, otherwise second score submission will overwrite the first one
		// 	{ player: '0x0000000000', score: 1 },
		// 	{ player: '0x4242424242', score: 2 },
		// ]
		await tmContract.submitGameResultRanked(scores)
	}

	// returns array of all available tournaments
	async function getTournaments() {
		const tmContract = await prepareContract()
		const tournaments = await tmContract.getTournaments()
		return tournaments as Tournament[]
	}

	// returns a single tournament
	async function getTournament(tournament_id: number) {
		const tmContract = await prepareContract()
		const tournament = await tmContract.getTournament(tournament_id)
		return tournament as Tournament
	}

	// returns tournament tree (array of games) of a single tournament
	async function getTournamentTree(tournament_id: number) {
		const tmContract = await prepareContract()
		const tournamentTree = await tmContract.getTournamentTree(tournament_id)
		return tournamentTree as Game[]
	}

	// returns information about a player
	// match history not included, only name and color
	async function getPlayer(address: string) {
		const tmContract = await prepareContract()
		const player = await tmContract.getPlayer(address)
		return player as Player
	}

	// returns array of all ranked games
	// this can be used to display a leaderboard, as well as match history of a player
	async function getRankedGames() {
		const tmContract = await prepareContract()
		const rankedGames = await tmContract.getRankedGames()
		return rankedGames as Game[]
	}

	// returns number of games played divided by accumulated score across all games
	async function getPlayerRankedElo() {
		const tmContract = await prepareContract()
		const playerElo = await tmContract.getPlayerRankedElo()
		return playerElo as number
	}

	// return (
	// 	<section>
	// 		<button onClick={startTournament}>Start Tournament</button>
	// 		<br/>
	// 		<button onClick={addScoreToTournament}>Add Score</button>
	// 		<br/>
	// 		<button onClick={getScoresOfTournament}>Get Scores</button>
	// 	</section>
	// )
};

export default Scores;
