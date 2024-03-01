'use client'

import { Vector3 } from "three";

import { usePongGameState } from "@/app/[lang]/pong/hooks/usePongGameState";
import { useBallLogic } from "@/app/[lang]/pong/hooks/useBallLogic";

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

/**
 * Creates a ball Three.js mesh and handles its movement and collision behavior.
 * @returns A Three.js mesh representing a ball.
 */
export const OneForAllBall : React.FC<{ onPositionChange: (position: Vector3) => void }> = ({ onPositionChange }) => {
	//* ------------------------------- hooks  ------------------------------ */
	const { isBallVisible, ballRef } = usePongGameState();
	const {color : ballColor } = useBallLogic(onPositionChange);

	const color = ballColor;

	return (
		<mesh ref={ballRef} visible={isBallVisible}>
			<boxGeometry args={[4, 4, 4]} />
			<meshBasicMaterial color={ color }/>
		</mesh>
	);
}