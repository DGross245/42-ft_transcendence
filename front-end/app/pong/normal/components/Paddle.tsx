import { useFrame } from "@react-three/fiber";
import { MutableRefObject, forwardRef, useContext } from "react";
import { Mesh } from 'three';
import { PongContext } from '../PongProvider';

interface Paddle {
	keyMap: { [key: string]: boolean };
	position: [number, number, number];
}

/**
 * Creates a Three.js mesh representing the right paddle for the game scene and manages its movement.
 * @param ref - Forwarded reference for more control in parent component.
 * @param keyMap - An object mapping keyboard keys to their pressed/unpressed state.
 * @param position - The initial position of the paddle in 3D space as an array of [x, y, z] coordinates.
 * @returns A Three.js mesh representing the paddle.
 */
export const RightPaddle = forwardRef<Mesh, Paddle>(({ keyMap, position }, ref) => {
	const { paddleState, updatePaddleState, opponentState } = useContext(PongContext)!;
	const paddleSpeed = 300;
	const borderPositionY = 103;
	const meshRef = ref as MutableRefObject<Mesh | null>;

	// Moves the paddle based on pressed key for each frame.
	useFrame((_, delta) => {
		if (meshRef && meshRef.current) {
			// RECEIVE PRESSED KEY = SET IT WITH updatePaddleState
			if (paddleState.keyMap['ArrowUp']) {
				meshRef.current.position.y = Math.min(meshRef.current.position.y + paddleSpeed * delta, borderPositionY - 15);
			} else if (paddleState.keyMap['ArrowDown']) {
				meshRef.current.position.y = Math.max(meshRef.current.position.y - paddleSpeed * delta, -borderPositionY + 15);
			}
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
	const { playerState } = useContext(PongContext)!;
	const paddleSpeed = 300;
	const borderPositionY = 103;
	const meshRef = ref as MutableRefObject<Mesh | null>;

	// Moves the paddle based on pressed key for each frame.
	useFrame((_, delta) => {
		if (meshRef && meshRef.current) {
			// SEND PRESSED KEY
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