import { useFrame } from "@react-three/fiber";
import { MutableRefObject, forwardRef, useContext } from "react";
import { Mesh } from 'three';
import { PongContext } from '../PongProvider';
import useWSClient from "@/helpers/wsclient";

interface Paddle {
	keyMap: { [key: string]: boolean };
	position: [number, number, number];
}

const stringConvert = (x: number, y: number ) => {
	const position = { x, y };

	const stringPos = JSON.stringify(position);
	return (stringPos);
}

/**
 * Creates a Three.js mesh representing the right paddle for the game scene and manages its movement.
 * @param ref - Forwarded reference for more control in parent component.
 * @param keyMap - An object mapping keyboard keys to their pressed/unpressed state.
 * @param position - The initial position of the paddle in 3D space as an array of [x, y, z] coordinates.
 * @returns A Three.js mesh representing the paddle.
 */
export const RightPaddle = forwardRef<Mesh, {position: [number, number, number]} >(({ position }, ref) => {
	const { paddleState, updatePaddleState, opponentState, gameId} = useContext(PongContext)!;
	const wsclient = useWSClient();
	const meshRef = ref as MutableRefObject<Mesh | null>;

	// Moves the paddle based on pressed key for each frame.
	useFrame(() => {
		wsclient?.addMessageListener('paddleUpdate', gameId, (msg: string) => {
			const position = JSON.parse(msg);
			updatePaddleState(position);
		});

		if (meshRef && meshRef.current) {
			const receivedPos = paddleState.position.y;
			meshRef.current.position.y = ((receivedPos - meshRef.current.position.y) * 0.1)
		}
	});

	return (
		<mesh ref={ref} position={position}>
			<boxGeometry args={[4, 30, 4]} />
			<meshBasicMaterial color={ opponentState.color } />
		</mesh>
	);
});

/**
 * Creates a Three.js mesh representing the right paddle for the game scene and manages its movement.
 * @param ref - Forwarded reference for more control in parent component.
 * @param keyMap - An object mapping keyboard keys to their pressed/unpressed state.
 * @param position - The initial position of the paddle in 3D space as an array of [x, y, z] coordinates.
 * @returns A Three.js mesh representing the paddle.
 */
export const LeftPaddle = forwardRef<Mesh, Paddle>(({ keyMap, position }, ref) => {
	const { playerState, gameId } = useContext(PongContext)!;
	const paddleSpeed = 300;
	const borderPositionY = 103;
	const meshRef = ref as MutableRefObject<Mesh | null>;
	const wsclient = useWSClient();
	
	// Moves the paddle based on pressed key for each frame.
	useFrame((_, delta) => {
		if (meshRef && meshRef.current) {
			const stringPos = stringConvert(meshRef.current.position.x, meshRef.current.position.y);
			wsclient?.emitMessageToGame(stringPos, 'paddleUpdate', gameId);
			if (keyMap['KeyW']) {
				meshRef.current.position.y = Math.min(meshRef.current.position.y + paddleSpeed * delta, borderPositionY - 15);
			} else if (keyMap['KeyS']) {
				meshRef.current.position.y = Math.max(meshRef.current.position.y - paddleSpeed * delta, -borderPositionY + 15);
			}
		}
	});

	return (
		<mesh ref={meshRef} position={position}>
			<boxGeometry args={[4, 30, 4]} />
			<meshBasicMaterial color={ playerState.color } />
		</mesh>
	);
});