"use client"

import { useWindow } from "@/components/hooks/useWindow";
import { Canvas } from "@react-three/fiber";
import { usePongGameEvent } from "../hooks/usePongGameEvent";
import Countdown from "@/components/Pong/Countdown";
import Camera from "@/components/Pong/Camera";
import { BottomPaddle, LeftPaddle, RightPaddle, TopPaddle } from "@/components/Pong/Paddle";
import { usePongGameState } from "../hooks/usePongGameState";
import { Ball } from "@/components/Pong/Ball";
import { CubeLineX, CubeLineY } from "@/components/Pong/CubeLine";
import { OrbitControls } from "@react-three/drei";
import Scoreboard from "@/components/Pong/Scoreboard";
import EndModal from "@/components/Pong/EndModal";
import { usePongSocketEvents } from "../hooks/usePongSocketEvent";
import { CornerBorder } from "@/components/Pong/Border";

/**
 * The OneForAllScene component is a Three.js scene representing a 4 player Pong game that includes various elements such as paddles,
 * ball, borders, camera, countdown, scoreboard, and a modal for displaying the winner.
 * @returns The entire Three.js scene, including the modal.
 */
export default function OneForAllScene() {
	const {dimensions} = useWindow();
	const maxClients = 4
	const { camPos, countdownPos, countdownRot } = usePongGameEvent( maxClients );

	usePongSocketEvents();

	return (
		<div >
			<Canvas style={{ width: dimensions.width, height: dimensions.height }}>
				<Countdown position={countdownPos} rotation={countdownRot} />
				<Camera position={camPos}/> 
				<CornerBorder />
				<TopPaddle />
				<BottomPaddle />
				<RightPaddle />
				<LeftPaddle />
				<Ball />
				<CubeLineY />
				<CubeLineX />
				<OrbitControls enablePan={false} enableRotate={true} />
				<Scoreboard />
			</Canvas>
			<EndModal />
		</div>
	);
}
