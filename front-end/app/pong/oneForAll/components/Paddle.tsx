import { useKey } from "@/components/useKey";
import { useFrame } from "@react-three/fiber";
import { MutableRefObject, forwardRef } from "react";
import * as THREE from 'three'
import { Mesh } from 'three';

// TODO: add later a getter/setter that sets the color for the player

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
	const borderPositionY = 111;
	const meshRef = ref as MutableRefObject<Mesh | null>;

	const up = useKey('ArrowUp');
	const down = useKey('ArrowDown')

	useFrame((_, delta) => {
		if (meshRef && meshRef.current) {
			if (up.isKeyDown) {
				meshRef.current.position.z = Math.max(meshRef.current.position.z - paddleSpeed * delta, -borderPositionY + 15);
			} else if (down.isKeyDown) {
				meshRef.current.position.z = Math.min(meshRef.current.position.z + paddleSpeed * delta, borderPositionY - 15);
			}
		}
	});

	return (
		<mesh ref={meshRef} position={position} rotation={[0, Math.PI / 2, Math.PI / 2]}>
			<boxGeometry args={[4, 30, 4]} />
			<meshBasicMaterial color={ 0xff0000 } />
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
	const borderPositionY = 111;
	const meshRef = ref as MutableRefObject<Mesh | null>;

	const up = useKey('KeyW');
	const down = useKey('KeyS')

	useFrame((_, delta) => {
		if (meshRef && meshRef.current) {
			if (up.isKeyDown) {
				meshRef.current.position.z = Math.max(meshRef.current.position.z - paddleSpeed * delta, -borderPositionY + 15);
			} else if (down.isKeyDown) {
				meshRef.current.position.z = Math.min(meshRef.current.position.z + paddleSpeed * delta, borderPositionY - 15);
			}
		}
	});

	return (
		<mesh ref={meshRef} position={position} rotation={[0, Math.PI / 2, Math.PI / 2]}>
			<boxGeometry args={[4, 30, 4]} />
			<meshBasicMaterial color={ 0x00ff00 } />
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
	const borderPositionX = 111;
	const meshRef = ref as MutableRefObject<Mesh | null>;

	const right = useKey('KeyD');
	const left = useKey('KeyA');

	useFrame((_, delta) => {
		if (meshRef && meshRef.current) {
			if (right.isKeyDown) {
				meshRef.current.position.x = Math.min(meshRef.current.position.x + paddleSpeed * delta, borderPositionX - 15);
			} else if (left.isKeyDown) {
				meshRef.current.position.x = Math.max(meshRef.current.position.x - paddleSpeed * delta, -borderPositionX + 15);
			}
		}
	});

	return (
		<mesh ref={meshRef} position={position} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
			<boxGeometry args={[4, 30, 4]} />
			<meshBasicMaterial color={ 0x00F5FF11 } />
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
	const borderPositionX = 111;
	const meshRef = ref as MutableRefObject<Mesh | null>;

	const right = useKey('ArrowRight');
	const left = useKey('ArrowLeft');

	useFrame((_, delta) => {
		if (meshRef && meshRef.current) {
			if (right.isKeyDown) {
				meshRef.current.position.x = Math.min(meshRef.current.position.x + paddleSpeed * delta, borderPositionX - 15);
			} else if (left.isKeyDown) {
				meshRef.current.position.x = Math.max(meshRef.current.position.x - paddleSpeed * delta, -borderPositionX + 15);
			}
		}
	});

	return (
		<mesh ref={ref} position={position} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
			<boxGeometry args={[4, 30, 4]} />
			<meshBasicMaterial color={ 0x1874CD } />
		</mesh>
	);
});