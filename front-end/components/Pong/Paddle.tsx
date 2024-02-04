import { usePongSocket } from "@/app/pong/hooks/usePongSocket";
import { useKey } from "@/components/hooks/useKey";
import { useFrame } from "@react-three/fiber";
import { MutableRefObject, forwardRef } from "react";
import { Mesh } from 'three';

interface Paddle {
	position: [number, number, number];
}

/**
 * Creates a Three.js mesh representing the right paddle for the game scene and manages its movement.
 * @param ref - Forwarded reference for more control in parent component.
 * @param keyMap - An object mapping keyboard keys to their pressed/unpressed state.
 * @param position - The initial position of the paddle in 3D space as an array of [x, y, z] coordinates.
 * @returns A Three.js mesh representing the paddle.
 */
export const RightPaddle = forwardRef<Mesh, Paddle>(({ position }, ref) => {
	const { playerState } = usePongSocket();
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
			<meshBasicMaterial color={ playerState.players[3].color } />
		</mesh>
	);
});

/**
 * Creates a Three.js mesh representing the left paddle for the game scene and manages its movement.
 * @param ref - Forwarded reference for more control in parent component.
 * @param position - The initial position of the paddle in 3D space as an array of [x, y, z] coordinates.
 * @returns A Three.js mesh representing the paddle.
 */
export const LeftPaddle = forwardRef<Mesh, Paddle>(({ position }, ref) => {
	const { playerState } = usePongSocket();
	const paddleSpeed = 300;
	const borderPositionY = 111;
	const meshRef = ref as MutableRefObject<Mesh | null>;

	const up = useKey(['W', 'w']);
	const down = useKey(['S', 's'])

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
			<meshBasicMaterial color={ playerState.players[1].color } />
		</mesh>
	);
});

/**
 * Creates a Three.js mesh representing the top paddle for the game scene and manages its movement.
 * @param ref - Forwarded reference for more control in parent component.
 * @param position - The initial position of the paddle in 3D space as an array of [x, y, z] coordinates.
 * @returns A Three.js mesh representing the paddle.
 */
export const TopPaddle = forwardRef<Mesh, Paddle>(({ position }, ref) => {
	const { playerState } = usePongSocket();
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
			<meshBasicMaterial color={ playerState.players[2].color } />
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
export const BottomPaddle = forwardRef<Mesh, Paddle>(({ position }, ref) => {
	const { playerState } = usePongSocket();
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
			<meshBasicMaterial color={ playerState.players[0].color } />
		</mesh>
	);
});