'use client'

import { usePongGameState } from "@/app/pong/hooks/usePongGameState";
import { useBallLogic } from "@/app/pong/hooks/useBallLogic";
import { useBall } from "@/app/pong/hooks/useNormalBall";

/**
 * Creates a ball Three.js mesh and handles its movement and collision behavior.
 * @param props - The `props` parameter is an object that contains the following properties:
 * 				  `rightPaddleRef`, `leftPaddleRef`,`p1Score`,`setP1Score`,`p2Score`,`setP2Score`,
 * 				  `topPaddleRef`, `bottomPaddleRef`, `p3Score`,`setP3Score`,`p4Score`,`setP4Score`,
 * 				  `setWinner`, `gameOver`, `setGameOver`, `scoreVisible`, `isBallVisible` and `setBallVisibility`
 * @returns A Three.js mesh representing a ball.
 */
export const Ball = ({ onPositionChange }) => {
	const { isBallVisible, ballRef, isGameMode } = usePongGameState();
	let color;

	if (isGameMode) {
		const {color : ballColor } = useBallLogic(onPositionChange);
		color = ballColor;
	}
	else {
		useBall(onPositionChange);
		color = 0xffffff;
	}

	return (
		<mesh ref={ballRef} visible={isBallVisible}>
			<boxGeometry args={[4, 4, 4]} />
			<meshBasicMaterial color={ color }/>
		</mesh>
	);
}