import { useFrame } from "@react-three/fiber";
import { MutableRefObject, forwardRef, useContext, useEffect, useRef } from "react";
import { Mesh } from 'three';
import { Direction } from "../../hooks/PongBot";

import { PongContext } from '../../PongProvider';
import { useKey } from "@/components/useKey";

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
export const RightPaddle = forwardRef<Mesh, { position: [number, number, number], botActive, botDirection }>(({ position }, ref) => {
	const { gameState, playerState } = useContext(PongContext)!;
	const meshRef = ref as MutableRefObject<Mesh | null>;
	const PositionRef = useRef<number>(0);

	useEffect(() => {
		const setNewCoords = (msg: string) => {
			const newPosition = JSON.parse(msg);
			PositionRef.current = newPosition;
		};

		gameState.wsclient?.addMessageListener(`paddleUpdate-${gameState.gameId}`, gameState.gameId, setNewCoords);

		return () => {
			gameState.wsclient?.removeMessageListener(`paddleUpdate-${gameState.gameId}`, gameState.gameId);
		};
	}, []);

	if (botActive) {
		useFrame((_, delta) => {
			if (meshRef && meshRef.current) {
				if (meshRef && meshRef.current) {
					if (botDirection === Direction.Up) {
						meshRef.current.position.y = Math.min(meshRef.current.position.y + paddleSpeed * delta, borderPositionY - 15);
					}
					else if (botDirection === Direction.Down) {
						meshRef.current.position.y = Math.max(meshRef.current.position.y - paddleSpeed * delta, -borderPositionY + 15);
					}
				}
			}
		});
	}

	if (!botActive) {
		// Moves the paddle based on pressed key for each frame.
		useFrame(() => {
			if (meshRef && meshRef.current) {
				meshRef.current.position.z = PositionRef.current;
			}
		});
	} 

	return (
		<mesh ref={ref} position={position} rotation={[Math.PI / 2, 0, 0]} >
			<boxGeometry args={[4, 30, 4]} />
			<meshBasicMaterial color={ playerState.players[1].color } />
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
export const LeftPaddle = forwardRef<Mesh, Paddle>(({ position }, ref) => {
	const { playerState, gameState } = useContext(PongContext)!;
	const paddleSpeed = 300;
	const borderPositionZ = 103;
	const meshRef = ref as MutableRefObject<Mesh | null>;
	
	const up = useKey('W');
	const down = useKey('S');

	// Moves the paddle based on pressed key for each frame.
	useFrame((_, delta) => {
		if (gameState.pause) {
			return ;
		}
		if (meshRef && meshRef.current) {
			const stringPos = JSON.stringify(meshRef.current.position.z);
			gameState.wsclient?.emitMessageToGame(stringPos, `paddleUpdate-${gameState.gameId}`, gameState.gameId);
			if (up.isKeyDown) {
				meshRef.current.position.z = Math.max(meshRef.current.position.z - paddleSpeed * delta, -borderPositionZ + 15);
			} else if (down.isKeyDown) {
				meshRef.current.position.z = Math.min(meshRef.current.position.z + paddleSpeed * delta, borderPositionZ - 15);
			}
		}
	});

	return (
		<mesh ref={meshRef} position={position} rotation={[Math.PI / 2, 0, 0]}>
			<boxGeometry args={[4, 30, 4]} />
			<meshBasicMaterial color={ playerState.players[0].color } />
		</mesh>
	);
});

// export const LeftPaddle = forwardRef<Mesh, Paddle>(({ position }, ref) => {
//     const { playerState, gameState } = useContext(PongContext);
//     const paddleSpeed = 300;
//     const borderPositionY = 103;
//     const meshRef = ref as MutableRefObject<Mesh | null>;
//     const paddlePositionRef = useRef<Vector3>(new Vector3(position[0], position[1], position[2]));

//     const movePaddle = (delta: number) => {
//         const direction = new Vector3().subVectors(paddlePositionRef.current, meshRef.current!.position).normalize();
//         const movement = direction.multiplyScalar(delta * paddleSpeed);
//         meshRef.current!.position.add(movement);
//     }

//     useFrame((_, delta) => {
//         movePaddle(delta);
//     });

//     useKey(['w','W'], (state) => {
//         if (state) {
//             const newY = Math.min(paddlePositionRef.current.y + paddleSpeed, borderPositionY - 15);
//             paddlePositionRef.current.y = newY;
//             meshRef.current!.position.setY(newY);
//         }
//     });

//     useKey(['s','S'], (state) => {
//         if (state) {
//             const newY = Math.max(paddlePositionRef.current.y - paddleSpeed, -borderPositionY + 15);
//             paddlePositionRef.current.y = newY;
//             meshRef.current!.position.setY(newY);
//         }
//     });

//     return (
//         <mesh ref={meshRef} position={paddlePositionRef.current.toArray()}>
//             <boxGeometry args={[4, 30, 4]} />
//             <meshBasicMaterial color={ playerState.color } />
//         </mesh>
//     );
// });
