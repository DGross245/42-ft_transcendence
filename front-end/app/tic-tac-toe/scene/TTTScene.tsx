"use client"

import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";

import { useWindow } from "../../../components/hooks/useWindow";
import { Grid } from "@/components/TTT/Grid";
import { FieldLayers } from "@/components/TTT/FieldLayers";
import Countdown from "@/components/TTT/Countdown";
import Camera from "@/components/TTT/Camera";
import Floor from "@/components/TTT/Floor";
import TurnDisplay from "@/components/TTT/TurnDisplay";
import FinishLine from "@/components/TTT/FinishLine";
import EndModal from "@/components/TTT/EndModal";
import { Table } from "@/components/TTT/Table";
import { TTTGameEvents } from "@/components/TTT/TTTGameEvents";
import { TTTSocketEvents } from "@/components/TTT/TTTSocketEvents";
import { TTTBot } from "@/components/TTT/TTTBot";
import { useState } from "react";
import { useGameState } from "../hooks/useGameState";
import { useSocket } from "../hooks/useSocket";

import { useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers5/react";
import { ethers, BigNumber } from 'ethers';
import { Tournament, contract_address } from "@/app/tournamentManager";
import scoresAbi from '@/public/tournamentManager_abi.json';

// FIXME: Sometimes if host is player2, his symbol isnt set and the game crashes

/**
 * The TTTScene component is a Three.js scene that represents the main scene of the Tic Tac Toe game.
 * It handles game state, user interactions, and 3D rendering of the game board.
 * Uses various hooks for state management and effects for handling game logic,
 * resizing, modal display, and game completion.
 * @returns The entire Three.js scene, including the modal.
 */
const TTTScene = () => {
	const { dimensions } = useWindow();
	const { wsclient } = useSocket();

	const { address, chainId, isConnected } = useWeb3ModalAccount();
	const { walletProvider } = useWeb3ModalProvider();
	const [topic, setTopic] = useState(-1);

	async function prepareContract() {
		if (!isConnected) throw Error("User disconnected")
		if (!walletProvider) throw Error("No wallet provider found")
		const provider =  new ethers.providers.Web3Provider(walletProvider)
		const signer = provider.getSigner()
		const tmContract = new ethers.Contract(contract_address, scoresAbi, signer)
		return tmContract
	}

	async function createTournament(duration_in_blocks: number) {
		const tmContract = await prepareContract();
		const result = await tmContract.createTournament(duration_in_blocks);
		const res = await result.wait();
		console.log(res.events.find((event: any) => event.event === 'TournamentCreated'));
	}

	async function joinTournament(tournament_id: number) {
		const tmContract = await prepareContract()
		await tmContract.joinTournament(tournament_id)
	}

	async function startTournament(tournament_id: number){
		const tmContract = await prepareContract()
		await tmContract.startTournament(tournament_id)
	}

	async function setNameAndColor(name: string, color: string) {
		const tmContract = await prepareContract()
		await tmContract.setNameAndColor(name, color)
	}

	const onTopicChange = (e: any) => {
		setTopic(e.target.value);
	}

	const onCreateTournament = async () => {
		if (!wsclient) return;
		await createTournament(3000);
		setTopic((await getTournaments()).length - 1);
	}

	const onSetNameAndColor = async () => {
		await setNameAndColor('KEK', '0x00ff00');
	}

	const onJoinTournament = async () =>{
		console.log("Topic", topic)
		await joinTournament(topic);
		wsclient?.joinTournament(topic);
	}

	const onStartTournament = () => {
		startTournament(topic);
		wsclient?.tournament(topic, 'TTT');
	}

	async function getTournaments() {
		const tmContract = await prepareContract()
		const tournaments = await tmContract.getTournaments()
		return tournaments as Tournament[]
	}

	const onGetTournaments = async () => {
		const t = await getTournaments();
		console.log(t);
	}

	return (
		<div style={{ width: '100%', height: '100%' }}>
				<input
					placeholder="Topic"
					value={topic}
					onChange={onTopicChange}
				/>
			<button onClick={onCreateTournament}> Create Tournament </button>
			<button onClick={onSetNameAndColor}> NAMEANDCOLOR </button>
			<button onClick={onJoinTournament}> Join Tournament </button>
			<button onClick={onStartTournament}> Start Tournament </button>
			<button onClick={onGetTournaments}> lol Tournament </button>
			<Canvas  style={{ width: dimensions.width, height: dimensions.height }}>
				<Camera />
				<Countdown />
				<Grid />
				<TTTBot />
				<TTTGameEvents />
				<TTTSocketEvents address={address} />
				<FieldLayers />
				<Floor position={[ 3, -0.2, 3]} args={[0.25, 23.2, 23.2]} /> 
				<Floor position={[ 3,  7.8, 3]} args={[0.25, 23.2, 23.2]} />
				<Floor position={[ 3, 15.8, 3]} args={[0.25, 23.2, 23.2]} />
				<Floor position={[ 3, 23.8, 3]} args={[0.25, 23.2, 23.2]} />
				<TurnDisplay />
				<FinishLine />
				<Table />
				<Environment preset="city" />
			</Canvas>
			<EndModal topic={topic} />
		</div> 
	);
}

export default TTTScene;