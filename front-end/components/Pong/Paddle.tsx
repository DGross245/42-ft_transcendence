import { usePongGameState } from "@/app/pong/hooks/usePongGameState";
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
export const RightPaddle = () => {
	const { playerState } = usePongSocket();
	const paddleSpeed = 300;
	const borderPositionY = 111;
	// const meshRef = ref as MutableRefObject<Mesh | null>;
	const { rightPaddleRef } = usePongGameState();

	const up = useKey('ArrowUp');
	const down = useKey('ArrowDown')

	useFrame((_, delta) => {
		if (rightPaddleRef && rightPaddleRef.current) {
			if (up.isKeyDown) {
				rightPaddleRef.current.position.z = Math.max(rightPaddleRef.current.position.z - paddleSpeed * delta, -borderPositionY + 15);
			} else if (down.isKeyDown) {
				rightPaddleRef.current.position.z = Math.min(rightPaddleRef.current.position.z + paddleSpeed * delta, borderPositionY - 15);
			}
		}
	});

	return (
		<mesh ref={rightPaddleRef} position={[151, 0, 0]} rotation={[0, Math.PI / 2, Math.PI / 2]}>
			<boxGeometry args={[4, 30, 4]} />
			<meshBasicMaterial color={ playerState.players[3].color } />
		</mesh>
	);
};

/**
 * Creates a Three.js mesh representing the left paddle for the game scene and manages its movement.
 * @param ref - Forwarded reference for more control in parent component.
 * @param position - The initial position of the paddle in 3D space as an array of [x, y, z] coordinates.
 * @returns A Three.js mesh representing the paddle.
 */
export const LeftPaddle = () => {
	const { playerState } = usePongSocket();
	const paddleSpeed = 300;
	const borderPositionY = 111;
	const { leftPaddleRef } = usePongGameState();

	const up = useKey(['W', 'w']);
	const down = useKey(['S', 's'])

	useFrame((_, delta) => {
		if (leftPaddleRef && leftPaddleRef.current) {
			if (up.isKeyDown) {
				leftPaddleRef.current.position.z = Math.max(leftPaddleRef.current.position.z - paddleSpeed * delta, -borderPositionY + 15);
			} else if (down.isKeyDown) {
				leftPaddleRef.current.position.z = Math.min(leftPaddleRef.current.position.z + paddleSpeed * delta, borderPositionY - 15);
			}
		}
	});

	return (
		<mesh ref={leftPaddleRef} position={[-151, 0, 0]} rotation={[0, Math.PI / 2, Math.PI / 2]}>
			<boxGeometry args={[4, 30, 4]} />
			<meshBasicMaterial color={ playerState.players[1].color } />
		</mesh>
	);
};

/**
 * Creates a Three.js mesh representing the top paddle for the game scene and manages its movement.
 * @param ref - Forwarded reference for more control in parent component.
 * @param position - The initial position of the paddle in 3D space as an array of [x, y, z] coordinates.
 * @returns A Three.js mesh representing the paddle.
 */
export const TopPaddle = () => {
	console.log("re-rendert paddle")
	const { playerState } = usePongSocket();
	const paddleSpeed = 300;
	const borderPositionX = 111;
	const { topPaddleRef } = usePongGameState();

	const right = useKey(['d', 'D']);
	const left = useKey(['a', 'A']);

	useFrame((_, delta) => {
		if (topPaddleRef && topPaddleRef.current) {
			if (right.isKeyDown) {
				topPaddleRef.current.position.x = Math.min(topPaddleRef.current.position.x + paddleSpeed * delta, borderPositionX - 15);
			} else if (left.isKeyDown) {
				topPaddleRef.current.position.x = Math.max(topPaddleRef.current.position.x - paddleSpeed * delta, -borderPositionX + 15);
			}
		}
	});

	return (
		<mesh ref={topPaddleRef} position={[0, 0, -151]} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
			<boxGeometry args={[4, 30, 4]} />
			<meshBasicMaterial color={ playerState.players[2].color } />
		</mesh>
	);
};

/**
 * Creates a Three.js mesh representing the bottom paddle for the game scene and manages its movement.
 * @param ref - Forwarded reference for more control in parent component.
 * @param keyMap - An object mapping keyboard keys to their pressed/unpressed state.
 * @param position - The initial position of the paddle in 3D space as an array of [x, y, z] coordinates.
 * @returns A Three.js mesh representing the paddle.
 */
export const BottomPaddle = () => {
	const { playerState } = usePongSocket();
	const paddleSpeed = 300;
	const borderPositionX = 111;
	const { bottomPaddleRef } = usePongGameState();

	const right = useKey('ArrowRight');
	const left = useKey('ArrowLeft');

	useFrame((_, delta) => {
		if (bottomPaddleRef && bottomPaddleRef.current) {
			if (right.isKeyDown) {
				bottomPaddleRef.current.position.x = Math.min(bottomPaddleRef.current.position.x + paddleSpeed * delta, borderPositionX - 15);
			} else if (left.isKeyDown) {
				bottomPaddleRef.current.position.x = Math.max(bottomPaddleRef.current.position.x - paddleSpeed * delta, -borderPositionX + 15);
			}
		}
	});

	return (
		<mesh ref={bottomPaddleRef} position={[0, 0, 151]} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
			<boxGeometry args={[4, 30, 4]} />
			<meshBasicMaterial color={ playerState.players[0].color } />
		</mesh>
	);
};