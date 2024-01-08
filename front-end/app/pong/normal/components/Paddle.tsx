import { useFrame } from "@react-three/fiber";
import { MutableRefObject, forwardRef } from "react";
import { Mesh } from 'three';

interface Paddle {
	keyMap: { [key: string]: boolean };
	position: [number, number, number];
}

/**
 * Creates a Three.js mesh representing the right paddle for the game scene and manages its movement.
 * @param ref - Forwarded reference for more control in parent component.
 * @returns A Three.js mesh representing the paddle.
 */
export const RightPaddle = forwardRef<Mesh, Paddle>(({ keyMap, position }, ref) => {
	const paddleSpeed = 300;
	const borderPositionY = 105;
	const meshRef = ref as MutableRefObject<Mesh | null>;

	// Moves the paddle based on pressed key for each frame.
	useFrame((_, delta) => {
		if (meshRef && meshRef.current) {
			if (keyMap['ArrowUp']) {
				meshRef.current.position.y = Math.min(meshRef.current.position.y + paddleSpeed * delta, borderPositionY - 15);
			} else if (keyMap['ArrowDown']) {
				meshRef.current.position.y = Math.max(meshRef.current.position.y - paddleSpeed * delta, -borderPositionY + 15);
			}
		}
	});

	return (
		<mesh ref={ref} position={position}>
			<boxGeometry args={[4, 30, 4]} />
			<meshBasicMaterial color={ 0xffffff } />
		</mesh>
	);
});

/**
 * Creates a Three.js mesh representing the right paddle for the game scene and manages its movement.
 * @returns A Three.js mesh representing the paddle.
 */
export const LeftPaddle = forwardRef<Mesh, Paddle>(({ keyMap, position }, ref) => {
	const paddleSpeed = 300;
	const borderPositionY = 105;
	const meshRef = ref as MutableRefObject<Mesh | null>;

	// Moves the paddle based on pressed key for each frame.
	useFrame((_, delta) => {
		if (meshRef && meshRef.current) {
			if (keyMap['KeyW']) {
				meshRef.current.position.y = Math.min(meshRef.current.position.y + paddleSpeed * delta, borderPositionY - 15);
			} else if (keyMap['KeyS']) {
				meshRef.current.position.y = Math.max(meshRef.current.position.y - paddleSpeed * delta, -borderPositionY + 15);
			}
		}
	});

	return (
		<mesh ref={ref} position={position}>
			<boxGeometry args={[4, 30, 4]} />
			<meshBasicMaterial color={ 0xffffff } />
		</mesh>
	);
});