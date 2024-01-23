'use client'

import { MutableRefObject, SetStateAction, forwardRef, Dispatch } from "react";
import { Mesh } from 'three';

import { useBall } from "../hooks/useBall";

interface BallProps {
	rightPaddleRef: MutableRefObject<Mesh>,
	leftPaddleRef: MutableRefObject<Mesh>,
	bottomPaddleRef: MutableRefObject<Mesh>,
	topPaddleRef: MutableRefObject<Mesh>,
	p1Score: number,
	setP1Score: Dispatch<SetStateAction<number>>,
	p2Score: number,
	setP2Score: Dispatch<SetStateAction<number>>,
	p3Score: number,
	setP3Score: Dispatch<SetStateAction<number>>,
	p4Score: number,
	setP4Score: Dispatch<SetStateAction<number>>,
	setWinner: Dispatch<SetStateAction<string>>,
	gameOver: boolean,
	setGameOver: Dispatch<SetStateAction<boolean>>,
	scoreVisible: boolean,
	isBallVisible: boolean,
	setBallVisibility: Dispatch<SetStateAction<boolean>>,
};

/**
 * Creates a ball Three.js mesh and handles its movement and collision behavior.
 * @param props - The `props` parameter is an object that contains the following properties:
 * 				  `rightPaddleRef`, `leftPaddleRef`,`p1Score`,`setP1Score`,`p2Score`,`setP2Score`,
 * 				  `topPaddleRef`, `bottomPaddleRef`, `p3Score`,`setP3Score`,`p4Score`,`setP4Score`,
 * 				  `setWinner`, `gameOver`, `setGameOver`, `scoreVisible`, `isBallVisible` and `setBallVisibility`
 * @returns A Three.js mesh representing a ball.
 */
export const Ball = forwardRef<Mesh, BallProps>((props, ref) => {
	const { color, meshRef } = useBall( props, ref );

	return (
		<mesh ref={meshRef} visible={props.isBallVisible}>
			<boxGeometry args={[4, 4, 4]} />
			<meshBasicMaterial color={ color }/>
		</mesh>
	);
})