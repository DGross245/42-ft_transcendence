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
import { PongModals } from "@/components/Pong/PongModals";

/**
 * The PongScene component is a Three.js scene representing a Pong game that includes various elements such as paddles,
 * ball, borders, camera, countdown, scoreboard, and a modal for displaying the winner.
 * @returns The entire Three.js scene, including the modal.
 */
export default function PongScene() { 
	const {dimensions} = useWindow();

	return (
		<div style={{ width: '100%', height: '100%' }}>
			<div className="scene-container">
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
			</div>
		</div>
	);
}