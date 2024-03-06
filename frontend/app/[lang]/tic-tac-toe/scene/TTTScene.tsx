"use client"

import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { useState } from "react";

import { useWindow } from "@/components/hooks/useWindow";
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
import useContract from "@/components/hooks/useContract";
import { TTTModals } from "@/components/TTT/TTTModals";
import { useGameState } from "../hooks/useGameState";
import { Button } from "@nextui-org/react";

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

/**
 * The TTTScene component is a Three.js scene that represents the main scene of the Tic Tac Toe game.
 * It handles game state, user interactions, and 3D rendering of the game board.
 * Uses various hooks for state management and effects for handling game logic,
 * resizing, modal display, and game completion.
 * @returns The entire Three.js scene, including the modal.
 */
const TTTScene : React.FC<{ selected: string }> = ({ selected }) => {
	const { dimensions } = useWindow();
	const { wsclient } = useSocket();
	const {
		createTournament,
		setNameAndColor,
		joinTournament,
		startTournament,
		getTournaments,
	} = useContract();
	const { updateGameState} = useGameState();
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
		await setNameAndColor('KEK', '0xffffff');
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

	const onkek = () => {
		wsclient?.requestTournament(topic, 'TTT');
	}

	const onJoin = () => {
		wsclient?.joinTournament(topic);
	}

	const onJoinCustom = () => {
		updateGameState({ gameId: String(topic) })
	}
	const onCreate = async () => {
		wsclient?.createGame();
	}

	const joinQueue = () => {
		wsclient?.joinQueue("tictactoe")
	}

	return (
		<div style={{ width: "100%", height: "100%" }}>
			<input
					placeholder="GAME/TOURNAMENT ID"
					value={topic}
					onChange={onTopicChange}
					id="4182"
					name="in"
			/>
			<Button onClick={onCreate}> Create Custom </Button>
			<Button onClick={onJoinCustom}> join Custom </Button>
			<Button onClick={joinQueue}> Queue </Button>
			<Button onClick={onCreateTournament}> Create Tournament </Button>
			<Button onClick={onJoin}>  Join tournament manually  </Button>
			<Button onClick={onSetNameAndColor}> setName&Color </Button>
			<Button onClick={onJoinTournament}> Join Tournament </Button>
			<Button onClick={onStartTournament}> Start Tournament </Button>
			<Button onClick={onGetTournaments}> print all Tournament </Button>
			<Button onClick={onkek}> start tournament manually </Button>
			<Button onClick={onGetTournaments}> getTournaments </Button>
			<div className="scene-container">
				<Canvas style={{ width: dimensions.width, height: dimensions.height - 128 }}>
					{/* <JoinGame selected={selected} /> */}
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
		</div>
	);
}

export default TTTScene;