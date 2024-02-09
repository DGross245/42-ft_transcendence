import { useFrame } from "@react-three/fiber";
import { MutableRefObject, forwardRef } from "react";
import { Mesh } from 'three'

import { usePongSocket } from "./usePongSocket";
import { usePongGameState } from "./usePongGameState";
import { useKey } from "@/components/hooks/useKey";

interface Paddle {
	position: [number, number, number];
	color: number;
	rotation: [number, number, number];
}

const Paddle = forwardRef<Mesh, Paddle>(({ position, color, rotation }, ref) => {
	return (
		<mesh ref={ref} position={position} rotation={rotation}>
			<boxGeometry args={[4, 30, 4]} />
			<meshBasicMaterial color={ color } />
		</mesh>
	);
})

export const PaddleControl = () => {
	const { playerState } = usePongSocket();
	const { bottomPaddleRef, leftPaddleRef, topPaddleRef, rightPaddleRef, playerPaddle } = usePongGameState();
	const paddleSpeed = 300;

	const right = useKey(['d', 'D']);
	const left = useKey(['a', 'A']);

	useFrame((_, delta) => {
		if (playerPaddle.ref && playerPaddle.ref.current) {
			if (right.isKeyDown) {
				if (playerState.client === 2 || playerState.client === 3)
					playerPaddle.pos = Math.max(playerPaddle.pos - paddleSpeed * delta, playerPaddle.minPos);
				else
					playerPaddle.pos = Math.min(playerPaddle.pos + paddleSpeed * delta, playerPaddle.maxPos);
			} else if (left.isKeyDown) {
				if (playerState.client === 0 || playerState.client === 1)
					playerPaddle.pos = Math.max(playerPaddle.pos - paddleSpeed * delta, playerPaddle.minPos);
				else
					playerPaddle.pos = Math.min(playerPaddle.pos + paddleSpeed * delta, playerPaddle.maxPos);
			}
			if (playerState.client === 0 || playerState.client === 2)
				playerPaddle.ref.current.position.x = playerPaddle.pos;
			else
				playerPaddle.ref.current.position.z = playerPaddle.pos;
		}
	});

	return  (
		<>
			<Paddle ref={bottomPaddleRef} position={[0, 0, 151]} color={playerState.players[0].color} rotation={[0, 0, Math.PI / 2]} />
			<Paddle ref={leftPaddleRef} position={[-151, 0, 0]}	color={playerState.players[1].color} rotation={[0, Math.PI / 2, Math.PI / 2]} />
			<Paddle ref={topPaddleRef} position={[0, 0, -151]}	color={playerState.players[2].color} rotation={[Math.PI / 2, 0, Math.PI / 2]} />
			<Paddle ref={rightPaddleRef} position={[151, 0, 0]}	color={playerState.players[3].color} rotation={[0, Math.PI / 2, Math.PI / 2]} />
		</>
	);
}
