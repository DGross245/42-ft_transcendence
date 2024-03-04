"use client"

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import Countdown from "@/components/Pong/Countdown";
import { useWindow } from "@/components/hooks/useWindow";
import Camera from "@/components/Pong/Camera";
import { CubeLine } from "@/components/Pong/CubeLine";
import { Scoreboard } from "../../../../components/Pong/NormalScoreboard";
import { LongBorder } from "@/components/Pong/Border";
import { PongGameEvents } from "@/components/Pong/PongGameEvents";
import { PongSocketEvents } from "@/components/Pong/PongSocketEvents";
import { GameControl } from "@/components/Pong/GameControl";
import useContract from "@/components/hooks/useContract";
import { useState } from "react";
import { usePongSocket } from "../hooks/usePongSocket";
import { PongModals } from "@/components/Pong/PongModals";
import { Button } from "@nextui-org/react";
import { usePongGameState } from "../hooks/usePongGameState";

/**
 * The PongScene component is a Three.js scene representing a Pong game that includes various elements such as paddles,
 * ball, borders, camera, countdown, scoreboard, and a modal for displaying the winner.
 * @returns The entire Three.js scene, including the modal.
 */
export default function PongScene() { 
	const {dimensions} = useWindow();
	const { wsclient } = usePongSocket();
	const {
		createTournament,
		setNameAndColor,
		joinTournament,
		startTournament,
		getTournaments,
		submitGameResultTournament
	} = useContract();
	const {pongGameState, updatePongGameState} = usePongGameState();
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

	const onkek = () => {
		wsclient?.requestTournament(topic, 'TTT');
	}

	const onJoin = () => {
		wsclient?.joinTournament(topic);
	}

	const onJoinCustom = () => {
		updatePongGameState({ gameId: String(topic) })
	}
	const onCreate = async () => {
		wsclient?.createGame();
	}

	const joinQueue = () => {
		wsclient?.joinQueue("tictactoe")
	}

	return (
		<div style={{ width: '100%', height: '100%' }}>
				<input
					placeholder="GAME/TOURNAMENT ID"
					value={topic}
					onChange={onTopicChange}
					id="KEK"
					name="KEK"
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
			{/* <div className="scene-container"> */}
				<Canvas style={{ width: dimensions.width, height: dimensions.height - 128 }}>
					<PongSocketEvents />
					<PongGameEvents />
					<Countdown />
					<Camera />
					<LongBorder position={[0, 0, -105]} />
					<LongBorder position={[0,0,105]} />
					<CubeLine />
					<GameControl />
					<OrbitControls
						enableZoom={false}
						enablePan={false}
						minPolarAngle={0}
						maxPolarAngle={Math.PI / 2}
					/>
					<Scoreboard />
				</Canvas>
				<PongModals />
			{/* </div> */}
		</div>
	);
}