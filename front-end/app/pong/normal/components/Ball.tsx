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

const Ball = (props) => {
	let ref = useRef<BallElement | null>(null);
	const ballRef = useRef({ x: 0, y: 0, velocityX: 0, velocityY: 0, speed: 0.1 });
	const halfPaddleWidth = 4 / 2;
	const HalfPaddleHeight = 30 / 2;
	const halfBall = 2;

	const changeBallDir = (paddlePos, direction) => {
		const ball = ballRef.current;
		const deltaY = ball.y - paddlePos.y;
		const normalizedY = deltaY / HalfPaddleHeight;

		if (ball.speed <= 2)
			ball.speed += 0.2;
		ball.velocityX = direction * ball.speed;
		ball.velocityY = normalizedY * ball.speed;
	}

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

	const updateBallPosition = (ball: { x: number; y: number; velocityX: number; velocityY: number; }, deltaTime: number) => {
		ball.x += ball.velocityX * 100 * deltaTime;
		ball.y += ball.velocityY * 100 * deltaTime;
		ref.current!.position.x = ball.x;
		ref.current!.position.y = ball.y;
	}

	// Initiates the game by providing a random direction to the ball after the countdown 
	// sets the score visibility to true
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

	// Game/Render loop
	useFrame((state, deltaTime) => {
		const ball = ballRef.current;

		updateBallPosition(ball, deltaTime);

		const rightPaddlePos = props.rightPaddleRef.current.position;
		const leftPaddlePos = props.leftPaddleRef.current.position;

		const isCollidingWithPaddle = (paddle: { x: number; y: number; }) => {
			return (
				ball.x + halfBall >= paddle.x - halfPaddleWidth &&
				ball.x - halfBall <= paddle.x + halfPaddleWidth &&
				ball.y - halfBall <= paddle.y + HalfPaddleHeight &&
				ball.y + halfBall >= paddle.y - HalfPaddleHeight
			);
		}

		if (ball.y > 100 || ball.y < -100) {
			ball.velocityY *= -1;
			updateBallPosition(ball, deltaTime);
		}
		else if (isCollidingWithPaddle(leftPaddlePos))
			changeBallDir(leftPaddlePos, 1);
		else if (isCollidingWithPaddle(rightPaddlePos))
			changeBallDir(rightPaddlePos, -1);
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