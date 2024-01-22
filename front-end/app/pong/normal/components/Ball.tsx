'use client'

import { MutableRefObject, SetStateAction, forwardRef, useEffect, useRef, Dispatch, useState, useContext } from "react";
import { useFrame } from '@react-three/fiber';
import { Mesh, MeshBasicMaterial } from 'three';
import { PongContext } from "../PongProvider";
import { useBall } from "../hooks/useBall";

// FIXME: Ball laggs on school macs and the ball can move through the paddle on high speed
// TODO: Refactor code for remote play
// FIXME: Fix update logic by also taking into account remote communication, implementing client-side prediction, lag compensation and synchronization.

interface ballPorps {
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

interface BallPackage {
	position: {
		x: number;
		y: number;
	};
	velocity: {
		x: number;
		y: number;
	};
	deltaTime: number;
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
export const Ball = forwardRef<Mesh, ballPorps>((props, ref) => {
	const meshRef = useBall( props, ref );
	return (
		<mesh ref={meshRef} visible={props.isBallVisible}>
			<boxGeometry args={[4, 4, 4]} />
			<meshBasicMaterial color={ 0xffffff } />
		</mesh>
	);
})