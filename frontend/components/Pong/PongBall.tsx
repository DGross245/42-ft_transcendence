'use client'

import { usePongGameState } from "@/app/[lang]/pong/hooks/usePongGameState";
import { useBall } from "@/app/[lang]/pong/hooks/useNormalBall";

/**
 * Creates a ball Three.js mesh and handles its movement and collision behavior.
 * @param props - The `props` parameter is an object that contains the following properties:
 * 				  `rightPaddleRef`, `leftPaddleRef`,`p1Score`,`setP1Score`,`p2Score`,`setP2Score`,
 * 				  `topPaddleRef`, `bottomPaddleRef`, `p3Score`,`setP3Score`,`p4Score`,`setP4Score`,
 * 				  `setWinner`, `gameOver`, `setGameOver`, `scoreVisible`, `isBallVisible` and `setBallVisibility`
 * @returns A Three.js mesh representing a ball.
 */
export const PongBall = ({ onPositionChange }) => {
	const { isBallVisible, ballRef } = usePongGameState();

	useBall(onPositionChange);

	return (
		<mesh ref={ballRef} visible={isBallVisible}>
			<boxGeometry args={[4, 4, 4]} />
			<meshBasicMaterial color={ 0xffffff }/>
		</mesh>
	);
}