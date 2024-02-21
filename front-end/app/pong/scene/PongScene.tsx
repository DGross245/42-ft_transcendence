"use client"

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stats } from "@react-three/drei";

import Countdown from "@/components/Pong/Countdown";
import { useWindow } from "@/components/hooks/useWindow";
import Camera from "@/components/Pong/Camera";
import { CubeLine } from "@/components/Pong/CubeLine";
import { Scoreboard } from "../NormalScoreboard";
import { LongBorder } from "@/components/Pong/Border";
import { PongGameEvents } from "@/components/Pong/PongGameEvents";
import { PongSocketEvents } from "@/components/Pong/PongSocketEvents";
import { GameControl } from "@/components/Pong/GameControl";
import useContract from "@/components/hooks/useContract";
import { useState } from "react";
import { usePongSocket } from "../hooks/usePongSocket";
import { PongModals } from "@/components/Pong/PongModals";

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
	const [topic, setTopic] = useState(-1);

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
		wsclient?.requestTournament(topic, 'Pong');
	}

	const onGetTournaments = async () => {
		const t = await getTournaments();
		console.log(t);
	}

	const onkek = () => {
		wsclient?.requestTournament(topic, 'Pong');
	}

	const onJoin = () => {
		wsclient?.joinTournament(topic);
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
			<div className="scene-container">
				<Canvas style={{ width: dimensions.width, height: dimensions.height }}>
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
					<Stats />
				</Canvas>
				<PongModals />
			</div>
		</div>
	);
}