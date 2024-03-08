import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Direction } from "../../app/[lang]/pong/hooks/usePongBot";

import { useKey } from "@/components/hooks/useKey";
import { usePongGameState } from "../../app/[lang]/pong/hooks/usePongGameState";
import { usePongSocket } from "../../app/[lang]/pong/hooks/usePongSocket";

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

/**
 * Creates a Three.js mesh representing the right paddle for the game scene and manages its movement.
 * @param ref - Forwarded reference for more control in parent component.
 * @param position - The initial position of the paddle in 3D space as an array of [x, y, z] coordinates.
 * @returns A Three.js mesh representing the paddle.
 */
export const RightPaddle : React.FC<{ direction: Direction }> = ({ direction }) => {
	//* ------------------------------- ref & hooks ------------------------------ */
	const { pongGameState, rightPaddleRef } = usePongGameState()
	const { wsclient, playerState } = usePongSocket();
	const { botState } = usePongGameState();
	const PositionRef = useRef<number>(0);

	const paddleSpeed = 300;
	const borderPositionZ = 103;

	//* ------------------------------- useEffects ------------------------------ */
	useEffect(() => {
		const setNewCoords = (msg: string) => {
			const newPosition = JSON.parse(msg);
			PositionRef.current = newPosition;
		};

		if (wsclient && pongGameState.gameId !== '-1') {
			wsclient?.addMessageListener(`paddleUpdate-${pongGameState.gameId}`, pongGameState.gameId, setNewCoords);

			return () => {
				wsclient?.removeMessageListener(`paddleUpdate-${pongGameState.gameId}`, pongGameState.gameId);
			};
		}
	}, [wsclient, pongGameState.gameId]);

	//* ------------------------------- render loop ------------------------------ */
	useFrame((_, delta) => {
		if (rightPaddleRef && rightPaddleRef.current) {
			if (botState.isActive && playerState.master) {
				if (direction === Direction.Up) {
					rightPaddleRef.current.position.z = Math.min(rightPaddleRef.current.position.z + paddleSpeed * delta, borderPositionZ - 15);
				} else if (direction === Direction.Down) {
					rightPaddleRef.current.position.z = Math.max(rightPaddleRef.current.position.z - paddleSpeed * delta, -borderPositionZ + 15);
				}
			} else {
				rightPaddleRef.current.position.z = PositionRef.current;
			}
		}
	});

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
	//* ------------------------------- hooks ------------------------------ */
	const { pongGameState, leftPaddleRef } = usePongGameState()
	const { wsclient, playerState } = usePongSocket();
	const up = useKey(['W', 'w']);
	const down = useKey(['S', 's'])

	const paddleSpeed = 300;
	const borderPositionZ = 103;

	//* ------------------------------- render loop ------------------------------ */

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