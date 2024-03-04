"use client"

import { useWindow } from "@/components/hooks/useWindow";
import { Canvas } from "@react-three/fiber";
import Countdown from "@/components/Pong/Countdown";
import Camera from "@/components/Pong/Camera";
import { CubeLineX, CubeLineY } from "@/components/Pong/CubeLine";
import { OrbitControls } from "@react-three/drei";
import Scoreboard from "@/components/Pong/Scoreboard";
import EndModal from "@/components/Pong/EndModal";
import { CornerBorder } from "@/components/Pong/Border";
import { PongGameEvents } from "@/components/Pong/PongGameEvents";
import { PongSocketEvents } from "@/components/Pong/PongSocketEvents";
import { GameControl } from "../../../../components/Pong/Paddle";
import { PongModals } from "@/components/Pong/PongModals";
import { useState } from "react";
import { Button } from "@nextui-org/react";
import { usePongGameState } from "../hooks/usePongGameState";
import { usePongSocket } from "../hooks/usePongSocket";

/**
 * The OneForAllScene component is a Three.js scene representing a 4 player Pong game that includes various elements such as paddles,
 * ball, borders, camera, countdown, scoreboard, and a modal for displaying the winner.
 * @returns The entire Three.js scene, including the modal.
 */
export default function OneForAllScene() {
	const {dimensions} = useWindow();
	const [topic, setTopic] = useState(0);
	const { updatePongGameState } = usePongGameState();
	const { wsclient } = usePongSocket();

	const onTopicChange = (e: any) => {
		setTopic(e.target.value);
	}
	const onJoinCustom = () => {
		updatePongGameState({ gameId: String(topic) })
	}
	const onCreate = async () => {
		wsclient?.createGame();
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
			<Canvas style={{ width: dimensions.width, height: dimensions.height - 128 }}>
				<PongGameEvents />
				<PongSocketEvents />
				<Countdown />
				<Camera/> 
				<CornerBorder />
				<GameControl />
				<CubeLineY />
				<CubeLineX />
				<OrbitControls
					enablePan={false}
					enableRotate={true}
					minPolarAngle={0}
					maxPolarAngle={Math.PI / 2}
					minDistance={10}
					maxDistance={800}
				/>
				<Scoreboard />
			</Canvas>
			<PongModals />
		</div>
	);
}
