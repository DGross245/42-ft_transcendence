"use client"

import Countdown from "@/components/Pong/Countdown";
import { useWindow } from "@/components/hooks/useWindow";
import { Canvas } from "@react-three/fiber";
import { usePongGameState } from "../hooks/usePongGameState";
import Camera from "@/components/Pong/Camera";
import EndModal from "@/components/Pong/EndModal";
import { OrbitControls, Stats } from "@react-three/drei";
import { CubeLine } from "@/components/Pong/CubeLine";
import { usePongGameEvent } from "../hooks/usePongGameEvent";
import { Ball } from "@/components/Pong/Ball";
import { usePongSocketEvents } from "../hooks/usePongSocketEvent";
import { Scoreboard } from "../NormalScoreboard";
import { LeftPaddle, RightPaddle } from "../NormalPaddle";
import { LongBorder } from "@/components/Pong/Border";

// TODO: Matchmaking, should handle the sockets and joining for games, at setting player info
// FIXME: Someotimes the guest or not host, counts the score twice

/**
 * The PongScene component is a Three.js scene representing a Pong game that includes various elements such as paddles,
 * ball, borders, camera, countdown, scoreboard, and a modal for displaying the winner.
 * @returns The entire Three.js scene, including the modal.
 */
export default function PongScene(/* maybe get gameId as param */) { // PlayerState needs to set too
	// const { active, direction, ballAidsHook } = usePongBot(true, 100, rightPaddleRef.current?.position);
	const {dimensions} = useWindow();
	const maxClients = 2;
	const { leftPaddleRef, rightPaddleRef } = usePongGameState();
	usePongGameEvent( maxClients );
	usePongSocketEvents();

	// botActive={active} botDirection={direction}
	// onPositionChange={ballAidsHook}
	return (
		<div style={{ width: '100%', height: '100%' }}>
			<Canvas style={{ width: dimensions.width, height: dimensions.height }}>
				<Countdown rotation={[-Math.PI /2, 0, 0]} position={[ [-23, 50, 0],[-35, 50, 0] ]} />
				<Camera position={[0, 400, 100]} />
				<LongBorder position={[0, 0, -105]} />
				<LongBorder position={[0,0,105]} />
				<RightPaddle ref={rightPaddleRef} position={[151, 0, 0]} />
				<LeftPaddle ref={leftPaddleRef} position={[-151, 0, 0]} />
				<Ball />
				<CubeLine />
				<OrbitControls enablePan={false} />
				<Scoreboard />
				<Stats />
			</Canvas>
			<EndModal />
		</div>
	);
}