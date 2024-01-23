'use client'

import { MutableRefObject, SetStateAction, forwardRef, Dispatch } from "react";
import { Mesh } from 'three';

import { useBall } from "../hooks/useBall";

interface BallProps {
	rightPaddleRef: MutableRefObject<Mesh>,
	leftPaddleRef: MutableRefObject<Mesh>,
	p1Score: number,
	setP1Score: Dispatch<SetStateAction<number>>,
	p2Score: number,
	setP2Score: Dispatch<SetStateAction<number>>,
	setWinner: Dispatch<SetStateAction<string>>,
	gameOver: boolean,
	setGameOver: Dispatch<SetStateAction<boolean>>,
	scoreVisible: boolean,
	isBallVisible: boolean,
	setBallVisibility: Dispatch<SetStateAction<boolean>>,
}

/**
 * Creates a ball Three.js mesh and handles its movement and collision logic.
 * @param props - The `props` parameter is an object that contains the following properties:
 * 				  `rightPaddleRef`, `leftPaddleRef`,`p1Score`,`setP1Score`,`p2Score`,`setP2Score`, `setWinner`, `gameOver`,
 * 				  `setGameOver`, `scoreVisible`, `isBallVisible` and `setBallVisibility`
 * @returns The Ball component is returning a mesh element that represents the ball in the game. It
 * 			consists of a boxGeometry with dimensions of 4x4x4 and a meshBasicMaterial with a color of (16, 16, 16).
 * 			The visibility of the mesh is determined by the isBallVisible prop.
 */
export const Ball = forwardRef<Mesh, BallProps>((props, ref) => {
	const meshRef = useBall( props, ref );
	return (
		<mesh ref={meshRef} visible={props.isBallVisible}>
			<boxGeometry args={[4, 4, 4]} />
			<meshBasicMaterial color={ 0xffffff } />
		</mesh>
	);
})