'use client'

import { useRef, useState } from "react";
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Ball = (props) => {
	let ref = useRef();
	const [isVisible, setVisibility] = useState(true);

	let ball = { x: 0, y: 0, velocityX: 1.5, velocityY: 1.5, speed: 2 };
	const halfPaddleWidth = 4 / 2;
	const HalfPaddleHeight = 30 / 2;
	const halfBall = 2;

	const updateBall = (paddlePos, direction) => {
		const deltaY = ball.y - paddlePos.y;
		const normalizedY = deltaY / HalfPaddleHeight;

		if (ball.speed <= 4)
			ball.speed += 0.2;
		ball.velocityX = direction * ball.speed;
		ball.velocityY = normalizedY * ball.speed;
	}

	useFrame(() => {
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
			if (ball.x < -200)
				props.setP2Score(props.p2Score + 1);
			else
				props.setP1Score(props.p1Score + 1);
			if (props.p2Score === 6){
				props.setGameOver(true);
				props.setWinner('P2');
				setVisibility(false);
				return
			}
			else if (props.p1Score === 6)
			{
				props.setGameOver(true);
				props.setWinner('P1');
				setVisibility(false);
				return
			}
			ball.x = 0;
			ball.y = 0;
			ball.velocityX = 1.5;
			ball.velocityY = 1.5;
			ball.speed = 2;
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