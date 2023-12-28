'use client'

import { useEffect, useRef, useState } from "react";
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Ball = (props) => {
	let ref = useRef();
	const [isVisible, setVisibility] = useState(true);

	const ballRef = useRef({ x: 0, y: 0, velocityX: 0, velocityY: 0, speed: 2 });
	const halfPaddleWidth = 4 / 2;
	const HalfPaddleHeight = 30 / 2;
	const halfBall = 2;

	const updateBall = (paddlePos, direction) => {
		const ball = ballRef.current;
		const deltaY = ball.y - paddlePos.y;
		const normalizedY = deltaY / HalfPaddleHeight;

		if (ball.speed <= 4)
			ball.speed += 0.2;
		ball.velocityX = direction * ball.speed;
		ball.velocityY = normalizedY * ball.speed;
	}

	const randomBallDir = () => {
		const ball = ballRef.current;
		ball.speed = 2;
		ball.x = 0;
		ball.y = 0;
	
		let randomNumber = Math.random();
		let angle = 360 * randomNumber;

		ball.velocityX = ball.speed * Math.sin(angle);
		while (ball.velocityX <= 0.6 && ball.velocityX >= -0.6) {
			let randomNumber = Math.random();
			let angle = 360 * randomNumber;
			ball.velocityX = ball.speed * Math.sin(angle);
		}
		ball.velocityY = ball.speed * Math.cos(angle);

		console.log(ball.velocityX, ball.velocityY);
		console.log(angle);
	}

	useEffect(() => {
		if (props.ScoreVisible){
			randomBallDir();
		}
	}, [props.ScoreVisible]);

	useEffect(() => {
		if (props.p2Score === 7) {
			props.setGameOver(true);
			props.setWinner('P2');
			setVisibility(false);
			return
		}
		else if (props.p1Score === 7) {
			props.setGameOver(true);
			props.setWinner('P1');
			setVisibility(false);
			return
		}
	}, [props.p1Score, props.p2Score]);

	useFrame(() => {
		const ball = ballRef.current;
		ball.x += ball.velocityX;
		ball.y += ball.velocityY;
		ref.current.position.x = ball.x;
		ref.current.position.y = ball.y;

		const rightPaddlePos = props.rightPaddleRef.current.position;
		const leftPaddlePos = props.leftPaddleRef.current.position;

		const isCollidingWithPaddle = (paddle: { x: number; y: number; }) => {
			return (
				ball.x + halfBall > paddle.x - halfPaddleWidth &&
				ball.x - halfBall < paddle.x + halfPaddleWidth &&
				ball.y - halfBall < paddle.y + HalfPaddleHeight &&
				ball.y + halfBall > paddle.y - HalfPaddleHeight
			);
		}

		if (ball.y > 100 || ball.y < -100) {
			ball.velocityY *= -1;
		}
		else if (isCollidingWithPaddle(leftPaddlePos)) {
			updateBall(leftPaddlePos, 1);
		}
		else if (isCollidingWithPaddle(rightPaddlePos)) {
			updateBall(rightPaddlePos, -1);
		}
		else if ((ball.x > 200 || ball.x < -200) && 
				props.p2Score !== 7 &&
				props.p1Score !== 7) {
			if (ball.x < -200) {
				props.setP2Score(props.p2Score + 1);
			}
			else {
				props.setP1Score(props.p1Score + 1);
			}
			randomBallDir();
		}

	});

	return (
		<mesh ref={ref} visible={isVisible}>
			<boxGeometry args={[4, 4, 4]} />
			<meshBasicMaterial
				color={new THREE.Color(16, 16, 16)}
				toneMapped={false}
				transparent={false}
				blending={THREE.AdditiveBlending}
				side={THREE.BackSide}
			/>
		</mesh>
	);
}

export default Ball;