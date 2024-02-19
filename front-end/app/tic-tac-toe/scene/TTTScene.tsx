"use client"

import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { useState } from "react";

import { useWindow } from "../../../components/hooks/useWindow";
import { Grid } from "@/components/TTT/Grid";
import { FieldLayers } from "@/components/TTT/FieldLayers";
import Countdown from "@/components/TTT/Countdown";
import Camera from "@/components/TTT/Camera";
import Floor from "@/components/TTT/Floor";
import TurnDisplay from "@/components/TTT/TurnDisplay";
import FinishLine from "@/components/TTT/FinishLine";
import { Table } from "@/components/TTT/Table";
import { TTTGameEvents } from "@/components/TTT/TTTGameEvents";
import { TTTSocketEvents } from "@/components/TTT/TTTSocketEvents";
import { TTTBot } from "@/components/TTT/TTTBot";
import { useSocket } from "../hooks/useSocket";
import useContract from "@/app/useContract";
import { TTTModals } from "@/components/TTT/TTTModals";
import { useGameState } from "../hooks/useGameState";


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
	const {
		createTournament,
		setNameAndColor,
		joinTournament,
		startTournament,
		getTournaments,
	} = useContract();
	const { updateGameState, gameState } = useGameState()
	const [topic, setTopic] = useState(0);

	const onTopicChange = (e: any) => {
		setTopic(e.target.value);
	}

	const onCreateTournament = async () => {
		if (!wsclient) return;
		await createTournament(300000000);
		setTopic((await getTournaments()).length - 1);
	}

	const onSetNameAndColor = async () => {
		await setNameAndColor('KEK', '0x00ff00');
	}

	const onJoinTournament = async () =>{
		await joinTournament(topic);
		wsclient?.joinTournament(topic);
	}

	const onStartTournament = async () => {
		await startTournament(topic);
		wsclient?.requestTournament(topic, 'TTT');
	}

	const onGetTournaments = async () => {
		const t = await getTournaments();
		console.log(t);
	}

	const onkek = () => {
		wsclient?.requestTournament(topic, 'TTT');
	}

	const onJoin = () => {
		// updateGameState({ ...gameState, gameId: topic })
		wsclient?.joinTournament(topic);
	}

	const onCreate = async () => {
		wsclient?.createGame();
	}

	return (
		<div style={{ width: '100%', height: '100%' }}>
				<input
					placeholder="Topic"
					value={topic}
					onChange={onTopicChange}
				/>
			{/* <button onClick={onCreate}> Create </button>
			<button onClick={onJoin}> join </button> */}
			<button onClick={onCreateTournament}> Create Tournament </button>
			<button onClick={onJoin}>  JOIN  </button>
			<button onClick={onSetNameAndColor}> NAMEANDCOLOR </button>
			<button onClick={onJoinTournament}> Join Tournament </button>
			<button onClick={onStartTournament}> Start Tournament </button>
			<button onClick={onGetTournaments}> lol Tournament </button>
			<button onClick={onkek}> print </button>
			<Canvas  style={{ width: dimensions.width, height: dimensions.height }}>
				<Camera />
				<Countdown />
				<Grid />
				<TTTBot />
				<TTTGameEvents />
				<TTTSocketEvents />
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
			<TTTModals />
		</div> 
	);
}

export default TTTScene;