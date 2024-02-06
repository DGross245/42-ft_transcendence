import { useFrame } from "@react-three/fiber";
import { MutableRefObject, forwardRef, useContext, useEffect, useRef } from "react";
import { Mesh } from 'three';
import { Direction } from "./hooks/PongBot";

import { useKey } from "@/components/hooks/useKey";
import { usePongGameState } from "./hooks/usePongGameState";
import { usePongSocket } from "./hooks/usePongSocket";

interface Paddle {
	position: [number, number, number];
	botActive?: boolean;
	botDirection?: Direction;
}

/**
 * Creates a Three.js mesh representing the right paddle for the game scene and manages its movement.
 * @param ref - Forwarded reference for more control in parent component.
 * @param position - The initial position of the paddle in 3D space as an array of [x, y, z] coordinates.
 * @returns A Three.js mesh representing the paddle.
 */
export const RightPaddle = () => {
	const { pongGameState, rightPaddleRef } = usePongGameState()
	const { wsclient, playerState } = usePongSocket();
	const PositionRef = useRef<number>(0);

	useEffect(() => {
		const setNewCoords = (msg: string) => {
			const newPosition = JSON.parse(msg);
			PositionRef.current = newPosition;
		};

		wsclient?.addMessageListener(`paddleUpdate-${pongGameState.gameId}`, pongGameState.gameId, setNewCoords);

		return () => {
			wsclient?.removeMessageListener(`paddleUpdate-${pongGameState.gameId}`, pongGameState.gameId);
		};
	}, [wsclient]);

	// if (botActive) {
	// 	useFrame((_, delta) => {
	// 		if (meshRef && meshRef.current) {
	// 			if (meshRef && meshRef.current) {
	// 				if (botDirection === Direction.Up) {
	// 					meshRef.current.position.y = Math.min(meshRef.current.position.y + paddleSpeed * delta, borderPositionY - 15);
	// 				}
	// 				else if (botDirection === Direction.Down) {
	// 					meshRef.current.position.y = Math.max(meshRef.current.position.y - paddleSpeed * delta, -borderPositionY + 15);
	// 				}
	// 			}
	// 		}
	// 	});
	// }

	// if (!botActive) {
		// Moves the paddle based on pressed key for each frame.
		useFrame(() => {
			if (rightPaddleRef && rightPaddleRef.current) {
				rightPaddleRef.current.position.z = PositionRef.current;
			}
		});
	// } 

	return (
		<mesh ref={rightPaddleRef} position={[151, 0, 0]} rotation={[Math.PI / 2, 0, 0]} >
			<boxGeometry args={[4, 30, 4]} />
			<meshBasicMaterial color={ playerState.players[1].color } />
		</mesh>
	);
};

/**
 * Creates a Three.js mesh representing the right paddle for the game scene and manages its movement.
 * @param ref - Forwarded reference for more control in parent component.
 * @param keyMap - An object mapping keyboard keys to their pressed/unpressed state.
 * @param position - The initial position of the paddle in 3D space as an array of [x, y, z] coordinates.
 * @returns A Three.js mesh representing the paddle.
 */
export const LeftPaddle = () => {
	const { pongGameState, leftPaddleRef } = usePongGameState()
	const { wsclient, playerState } = usePongSocket();

	const paddleSpeed = 300;
	const borderPositionZ = 103;
	
	const up = useKey(['W', 'w']);
	const down = useKey(['S', 's'])

	// Moves the paddle based on pressed key for each frame.
	useFrame((_, delta) => {
		if (pongGameState.pause) {
			return ;
		}
		if (leftPaddleRef && leftPaddleRef.current) {
			const stringPos = JSON.stringify(leftPaddleRef.current.position.z);
			wsclient?.emitMessageToGame(stringPos, `paddleUpdate-${pongGameState.gameId}`, pongGameState.gameId);
			if (up.isKeyDown) {
				leftPaddleRef.current.position.z = Math.max(leftPaddleRef.current.position.z - paddleSpeed * delta, -borderPositionZ + 15);
			} else if (down.isKeyDown) {
				leftPaddleRef.current.position.z = Math.min(leftPaddleRef.current.position.z + paddleSpeed * delta, borderPositionZ - 15);
			}
		}
	});

	return (
		<mesh ref={leftPaddleRef} position={[-151, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
			<boxGeometry args={[4, 30, 4]} />
			<meshBasicMaterial color={ playerState.players[0].color } />
		</mesh>
	);
};