'use client'

import { useEffect, useRef } from "react";
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type BallElement = {
	position: {
		x: number;
		y: number;
	}
}

/**
 * Creates a ball Three.js mesh and handles its movement and collision behavior.
 * @param props 
 * @returns A Three.js mesh representing a ball.
 */
const Ball = (props) => {
	let ref = useRef<BallElement | null>(null);
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
	const changeBallDir = (paddlePos, direction) => {
		const ball = ballRef.current;
		const deltaY = ball.y - paddlePos.y;
		const normalizedY = deltaY / halfPaddleHeight;

		if (ball.speed <= 2)
			ball.speed += 0.2;
		ball.velocityX = direction * ball.speed;
		ball.velocityY = normalizedY * ball.speed;
	}

	// TODO: Maybe rework the randomBallDir: remove the while causing unnecessary loops
	// TODO: Maybe explain more how the function works
	/**
	 * Sets the ball back to the middle and generates a random direction for the ball.
	 */
	const randomBallDir = () => {
		const ball = ballRef.current;
		ball.x = 0;
		ball.y = 0;
		ball.speed = 1.2;

		let randomNumber = Math.random();
		let angle = 360 * randomNumber;
		const angleOffset = 60; 

		ball.velocityX = ball.speed * Math.sin(angle);
		while (ball.velocityX <= 0.6 && ball.velocityX >= -0.6) {
			randomNumber = Math.random();
			angle = 360 * randomNumber;
			ball.velocityX = ball.speed * Math.sin(angle);
		}

		ball.velocityY = ball.speed * Math.cos(angle + angleOffset);
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
		ref.current!.position.x = ball.x;
		ref.current!.position.y = ball.y;
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
		else if (isCollidingWithPaddle(leftPaddlePos))
			changeBallDir(leftPaddlePos, 1);
		else if (isCollidingWithPaddle(rightPaddlePos))
			changeBallDir(rightPaddlePos, -1);
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
			<meshBasicMaterial color={new THREE.Color(16, 16, 16)} />
		</mesh>
	);
}

export default Ball;