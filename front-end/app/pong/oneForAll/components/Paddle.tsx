import { useFrame } from "@react-three/fiber";
import { MutableRefObject, forwardRef } from "react";
import * as THREE from 'three'
import { Mesh } from 'three';

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
	const paddleSpeed = 300;
	const borderPositionY = 113;
	const meshRef = ref as MutableRefObject<Mesh | null>;

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
		<mesh ref={meshRef} position={position}>
			<boxGeometry args={[4, 30, 4]} />
			<meshBasicMaterial color={ 0xffffff } />
		</mesh>
	);
});

/**
 * Creates a Three.js mesh representing the left paddle for the game scene and manages its movement.
 * @param ref - Forwarded reference for more control in parent component.
 * @param keyMap - An object mapping keyboard keys to their pressed/unpressed state.
 * @param position - The initial position of the paddle in 3D space as an array of [x, y, z] coordinates.
 * @returns A Three.js mesh representing the paddle.
 */
export const LeftPaddle = forwardRef<Mesh, Paddle>(({ keyMap, position }, ref) => {
	const paddleSpeed = 300;
	const borderPositionY = 113;
	const meshRef = ref as MutableRefObject<Mesh | null>;

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
		<mesh ref={meshRef} position={position}>
			<boxGeometry args={[4, 30, 4]} />
			<meshBasicMaterial color={ 0xffffff } />
		</mesh>
	);
});

/**
 * Creates a Three.js mesh representing the top paddle for the game scene and manages its movement.
 * @param ref - Forwarded reference for more control in parent component.
 * @param keyMap - An object mapping keyboard keys to their pressed/unpressed state.
 * @param position - The initial position of the paddle in 3D space as an array of [x, y, z] coordinates.
 * @returns A Three.js mesh representing the paddle.
 */
export const TopPaddle = forwardRef<Mesh, Paddle>(({ keyMap, position }, ref) => {
	const paddleSpeed = 300;
	const borderPositionY = 113;
	const meshRef = ref as MutableRefObject<Mesh | null>;

	useFrame((_, delta) => {
		if (meshRef && meshRef.current) {
			if (keyMap['KeyD']) {
				meshRef.current.position.x = Math.min(meshRef.current.position.x + paddleSpeed * delta, borderPositionY - 15);
			} else if (keyMap['KeyA']) {
				meshRef.current.position.x = Math.max(meshRef.current.position.x - paddleSpeed * delta, -borderPositionY + 15);
			}
		}
	});

	return (
		<mesh ref={meshRef} position={position} rotation={[0, 0, Math.PI / 2]}>
			<boxGeometry args={[4, 30, 4]} />
			<meshBasicMaterial color={ 0xffffff } />
		</mesh>
	);
});

/**
 * Creates a Three.js mesh representing the bottom paddle for the game scene and manages its movement.
 * @param ref - Forwarded reference for more control in parent component.
 * @param keyMap - An object mapping keyboard keys to their pressed/unpressed state.
 * @param position - The initial position of the paddle in 3D space as an array of [x, y, z] coordinates.
 * @returns A Three.js mesh representing the paddle.
 */
export const BottomPaddle = forwardRef<Mesh, Paddle>(({ keyMap, position }, ref) => {
	const paddleSpeed = 300;
	const borderPositionY = 113;
	const meshRef = ref as MutableRefObject<Mesh | null>;

	useFrame((_, delta) => {
		if (meshRef && meshRef.current) {
			if (keyMap['ArrowRight']) {
				meshRef.current.position.x = Math.min(meshRef.current.position.x + paddleSpeed * delta, borderPositionY - 15);
			} else if (keyMap['ArrowLeft']) {
				meshRef.current.position.x = Math.max(meshRef.current.position.x - paddleSpeed * delta, -borderPositionY + 15);
			}
		}
	});

	return (
		<mesh ref={meshRef} position={position} rotation={[0, 0, Math.PI / 2]} >
			<boxGeometry args={[4, 30, 4]} />
			<meshBasicMaterial color={ 0xffffff } />
		</mesh>
	);
});