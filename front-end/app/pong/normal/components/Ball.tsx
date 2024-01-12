'use client'

import { Ref, useEffect, useRef } from "react";
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { pong } from "../../../../components/Sound"
// FIXME: Ball laggs on school macs and the ball can move through the paddle on high speed

interface ballPorps {
	rightPaddleRef: React.MutableRefObject<THREE.Mesh>,
	leftPaddleRef: React.MutableRefObject<THREE.Mesh>,
	p1Score: number,
	setP1Score: React.Dispatch<React.SetStateAction<number>>,
	p2Score: number,
	setP2Score: React.Dispatch<React.SetStateAction<number>>,
	setWinner: React.Dispatch<React.SetStateAction<string>>,
	gameOver: boolean,
	setGameOver: React.Dispatch<React.SetStateAction<boolean>>,
	scoreVisible: boolean,
	isBallVisible: boolean,
	setBallVisibility: React.Dispatch<React.SetStateAction<boolean>>,
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
const Ball : React.FC<ballPorps> = (props) => {
	let ref = useRef<THREE.Mesh>(null);
	const ballRef = useRef({ x: 0, y: 0, velocityX: 0, velocityY: 0, speed: 0.1 });
	const halfPaddleWidth = 4 / 2;
	const halfPaddleHeight = 30 / 2;
	const halfBall = 2;

	/**
	 * Changes the ball's direction after it collided with a paddle.
	 * @param paddlePos - the position of the paddle.
	 * 					  Contains 'x' and 'y' properties.
	 * @param direction - The direction (1 or -1) indicating the side of the paddle the ball collided with:
	 * 					  1: Collided with the left paddle.
	 * 					 -1: Collided with the right paddle.
	 */
	const changeBallDir = (paddlePos: THREE.Vector3, direction: number) => {
		const ball = ballRef.current;
		const deltaY = ball.y - paddlePos.y;
		const normalizedY = deltaY / halfPaddleHeight;

		if (ball.speed <= 2)
			ball.speed += 0.2;
		ball.velocityX = direction * ball.speed;
		ball.velocityY = normalizedY * ball.speed;
	}

	/**
	 * Sets the ball back to the middle and generates a random direction for the ball.
	 * It randomly takes one specified range and calculates with it a angle to determin the ball's direction.
	 */
	const randomBallDir = () => {
		let ball = ballRef.current;
		ball.x = 0;
		ball.y = 0;
		ball.speed = 1.2;

		const ranges = [
			{min: -37.5, max: 37.5},
			{min: 142.5, max: 218.5},
		];

		const { min, max } = ranges[Math.floor(Math.random() * ranges.length)];
		const angle = (Math.random() * (max - min) + min) * (Math.PI / 180);

		ball.velocityX = ball.speed * Math.sin(angle + (Math.PI / 2));
		ball.velocityY = ball.speed * Math.cos(angle + (Math.PI / 2));
	}

	/**
	 * Updates the new position of the ball based on its velocity and the time passed since last frame (deltaTime).
	 * @param ball - The ball object containing position and velocity properties.
	 * 				 Contains 'x', 'y', 'velocityX', and 'velocityY' fields.
	 * @param deltaTime - The time passed since the last frame, in seconds.
	 * 					  Used to ensure independence from the frame rate.
	 */
	const updateBallPosition = (ball: { x: number; y: number; velocityX: number; velocityY: number; }, deltaTime: number) => {
		ball.x += ball.velocityX * 100 * deltaTime;
		ball.y += ball.velocityY * 100 * deltaTime;
		if (ref.current) {
			ref.current.position.x = ball.x;
			ref.current.position.y = ball.y;
		}
	}

	/**
	 * Initiates the game by providing a random direction to the ball after the countdown 
	 * sets the score visibility to true.
	 */
	useEffect(() => {
		if (props.scoreVisible)
			randomBallDir();
	}, [props.scoreVisible]);

	useEffect(() => {
		const checkWinner = (player: string, playerScore: number) => {
			if (playerScore === 7) {
				let ball = ballRef.current;
				ball.x = 0;
				ball.y = 0;
				ball.velocityX = 0;
				ball.velocityY = 0;
				ball.speed = 0.1;
				props.setGameOver(true);
				props.setWinner(player);
				props.setBallVisibility(false);
			}
		}

		checkWinner('P1', props.p1Score);
		checkWinner('P2', props.p2Score);
	}, [props.p1Score, props.p2Score]);

	// Game/render loop for the ball.
	useFrame((state, deltaTime) => {
		const ball = ballRef.current;

		updateBallPosition(ball, deltaTime);

		const rightPaddlePos = props.rightPaddleRef.current.position;
		const leftPaddlePos = props.leftPaddleRef.current.position;

		const isCollidingWithPaddle = (paddle: { x: number; y: number; }) => {
			return (
				ball.x + halfBall >= paddle.x - halfPaddleWidth &&
				ball.x - halfBall <= paddle.x + halfPaddleWidth &&
				ball.y - halfBall <= paddle.y + halfPaddleHeight &&
				ball.y + halfBall >= paddle.y - halfPaddleHeight
			);
		}

		// Handling ball collision with top and bottom boarders.
		if (ball.y > 100 || ball.y < -100) {
			ball.velocityY *= -1;
			updateBallPosition(ball, deltaTime);
		}
		// Handling ball collision with paddles.
		else if (isCollidingWithPaddle(leftPaddlePos)) {
			pong();
			changeBallDir(leftPaddlePos, 1);
		}
		else if (isCollidingWithPaddle(rightPaddlePos)) {
			pong();
			changeBallDir(rightPaddlePos, -1);
		}
		// Handling scoring when the ball is outside of the play area.
		else if ((ball.x > 200 || ball.x < -200) && 
				props.p2Score !== 7 && props.p1Score !== 7) {
			if (ball.x < -200)
				props.setP2Score(props.p2Score + 1);
			else
				props.setP1Score(props.p1Score + 1);
			randomBallDir();
		}
	});

	return (
		<mesh ref={ref} visible={props.isBallVisible}>
			<boxGeometry args={[4, 4, 4]} />
			<meshBasicMaterial color={ 0xffffff } />
		</mesh>
	);
}

export default Ball;