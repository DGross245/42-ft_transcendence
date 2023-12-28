"use client"

import { ethers } from 'ethers';
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers5/react'
import scoresAbi from '../public/tournamentManager_abi.json';
import erc20Abi from '../public/erc20_abi.json';

const contract_address = '0x7caAf92b911860Bc643C00981DAAc5616E05A3f5'

function Scores() {
	const { address, chainId, isConnected } = useWeb3ModalAccount()
	const { walletProvider } = useWeb3ModalProvider()

	// @note how to make private?
	async function prepareContract(){
		if (!isConnected) throw Error("User disconnected")
		if (!walletProvider) throw Error("No wallet provider found")
		const provider =  new ethers.providers.Web3Provider(walletProvider)
		const signer = provider.getSigner()
		const tmContract = new ethers.Contract(contract_address, scoresAbi, signer)
		return tmContract
	}

	async function startTournament(){
		const tmContract = await prepareContract()
		const duration_in_blocks = 100
		await tmContract.startTournament(duration_in_blocks)
	}

	async function addScoreToTournament(){
		const tmContract = await prepareContract()
		const tournament_id = 0
		const player_addr = address
		const score = 100
		await tmContract.addScoreToTournament(tournament_id, player_addr, score)
	}

	async function getScoresOfTournament(){
		const tmContract = await prepareContract()
		const tournament_id = 0
		const scores = await tmContract.getScoresOfTournament(tournament_id)
		console.log(scores)
	}

	async function setNameAndColor(){
		const tmContract = await prepareContract()
		const name = 'test'
		const color = '0xFF0000'
		await tmContract.setNameAndColor(name, color)
	}

	return (
		<section>
			<button onClick={startTournament}>Start Tournament</button>
			<br/>
			<button onClick={addScoreToTournament}>Add Score</button>
			<br/>
			<button onClick={getScoresOfTournament}>Get Scores</button>
		</section>
	)
};

export default Scores;
