'use client'

import React from "react";
import { Vector3 } from "three";

import { usePongGameState } from "@/app/[lang]/pong/hooks/usePongGameState";
import { useBall } from "@/app/[lang]/pong/hooks/useNormalBall";

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

/**
 * Creates a ball Three.js mesh and handles its movement and collision behavior.
 * @returns A Three.js mesh representing a ball.
 */
export const PongBall : React.FC<{ onPositionChange: (position: Vector3) => void }> = ({ onPositionChange }) => {
	const { isBallVisible, ballRef } = usePongGameState();

	useBall(onPositionChange);

	return (
		<mesh ref={ballRef} visible={isBallVisible}>
			<boxGeometry args={[4, 4, 4]} />
			<meshBasicMaterial color={ 0xffffff }/>
		</mesh>
	);
}