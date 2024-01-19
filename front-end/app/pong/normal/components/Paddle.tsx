import { useFrame } from "@react-three/fiber";
import { MutableRefObject, forwardRef, useContext, useEffect, useRef } from "react";
import { Mesh } from 'three';
import { PongContext } from '../PongProvider';

interface Paddle {
	keyMap: { [key: string]: boolean };
	position: [number, number, number];
}

const stringConvert = (y: number ) => {
	const stringPos = JSON.stringify(y);
	return (stringPos);
}

/**
 * Creates a Three.js mesh representing the right paddle for the game scene and manages its movement.
 * @param ref - Forwarded reference for more control in parent component.
 * @param position - The initial position of the paddle in 3D space as an array of [x, y, z] coordinates.
 * @returns A Three.js mesh representing the paddle.
 */
export const RightPaddle = forwardRef<Mesh, { position: [number, number, number] }>(({ position }, ref) => {
	const { gameState, opponentState } = useContext(PongContext)!;
	const meshRef = ref as MutableRefObject<Mesh | null>;
	const PositionRef = useRef<number>(0);

	useEffect(() => {
		const setNewCoords = (msg: string) => {
			const newPosition = JSON.parse(msg);
			PositionRef.current = newPosition;
			//console.log(newPosition, 'paddleUpdate', gameState.gameId);
		};

		gameState.wsclient?.addMessageListener('paddleUpdate', gameState.gameId, setNewCoords);

		return () => {
			gameState.wsclient?.removeMessageListener('paddleUpdate', gameState.gameId);
		};
	}, []);

	// Moves the paddle based on pressed key for each frame.
	useFrame(() => {
		if (meshRef && meshRef.current) {
			meshRef.current.position.y = PositionRef.current;
		}
	});

	return (
		<mesh ref={ref} position={position}>
			<boxGeometry args={[4, 30, 4]} />
			<meshBasicMaterial color={opponentState.color} />
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
	const { playerState, gameState } = useContext(PongContext)!;
	const paddleSpeed = 300;
	const borderPositionY = 103;
	const meshRef = ref as MutableRefObject<Mesh | null>;
	
	// Moves the paddle based on pressed key for each frame.
	useFrame((_, delta) => {
		if (gameState.pause) {
			console.log("PAUSE");
			return ;
		}
		if (meshRef && meshRef.current) {
			const stringPos = stringConvert(meshRef.current.position.y);
			gameState.wsclient?.emitMessageToGame(stringPos, 'paddleUpdate', gameState.gameId);
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