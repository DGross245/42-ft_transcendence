"use client"

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import { useWindow } from "@/components/hooks/useWindow";
import Countdown from "@/components/Pong/Countdown";
import Camera from "@/components/Pong/Camera";
import { CubeLineX, CubeLineY } from "@/components/Pong/CubeLine";
import Scoreboard from "@/components/Pong/Scoreboard";
import { CornerBorder } from "@/components/Pong/Border";
import { PongGameEvents } from "@/components/Pong/PongGameEvents";
import { PongSocketEvents } from "@/components/Pong/PongSocketEvents";
import { GameControl } from "@/components/Pong/Paddle";
import { PongModals } from "@/components/Pong/PongModals";

/**
 * The OneForAllScene component is a Three.js scene representing a 4 player Pong game that includes various elements such as paddles,
 * ball, borders, camera, countdown, scoreboard, and a modal for displaying the winner.
 * @returns The entire Three.js scene, including the modal.
 */
export default function OneForAllScene() {
	const {dimensions} = useWindow();

	return (
		<div style={{ width: '100%', height: '100%' }}>
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