'use client'

import { useRef, useState } from "react";
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BottomPaddle, TopPaddle } from "./Paddle";

// TODO: ADD a random ball dir
// TODO: Rework win detection 
// FIXME: Ball resets after resizing
 
const Ball = (props) => {
	let ref = useRef();
	const [isVisible, setVisibility] = useState(true);

	let ball = { x: 0, y: 0, velocityX: 0, velocityY: 1, speed: 2 };
	const halfPaddleWidth = 4 / 2;
	const HalfPaddleHeight = 30 / 2;
	const HalfBorderHeight = 40 / 2;
	const HalfBorderWidth = 4 / 2;
	const halfBall = 2;

	const updateBall = (paddlePos, direction) => {
		const deltaY = ball.y - paddlePos.y;
		const normalizedY = deltaY / HalfPaddleHeight;

		if (ball.speed <= 4)
			ball.speed += 0.2;
		ball.velocityX = direction * ball.speed;
		ball.velocityY = normalizedY * ball.speed;
	}

	const updateBall2 = (paddlePos, direction) => {
		const deltaX = ball.x - paddlePos.x;
		const normalizedX = deltaX / HalfPaddleHeight;

		if (ball.speed <= 4)
			ball.speed += 0.2;
		ball.velocityX = normalizedX * ball.speed;
		ball.velocityY = direction * ball.speed;
	}

	useFrame(() => {
		ball.x += ball.velocityX;
		ball.y += ball.velocityY;
		ref.current.position.x = ball.x;
		ref.current.position.y = ball.y;
		const rightPaddlePos = props.rightPaddleRef.current.position;
		const leftPaddlePos = props.leftPaddleRef.current.position;
		const TopPaddlePos = props.topPaddleRef.current.position;
		const BottomPaddlePos = props.bottomPaddleRef.current.position;

		const isCollidingWithPaddle = (paddle: { x: number; y: number; }) => {
			return (
				ball.x + halfBall > paddle.x - halfPaddleWidth &&
				ball.x - halfBall < paddle.x + halfPaddleWidth &&
				ball.y - halfBall < paddle.y + HalfPaddleHeight &&
				ball.y + halfBall > paddle.y - HalfPaddleHeight
			);
		}

		const isCollidingWithPaddle2 = (paddle: { x: number; y: number; }) => {
			return (
				ball.x + halfBall > paddle.x - HalfPaddleHeight &&
				ball.x - halfBall < paddle.x + HalfPaddleHeight &&
				ball.y - halfBall < paddle.y + halfPaddleWidth &&
				ball.y + halfBall > paddle.y - halfPaddleWidth
			);
		}

		const isBorder = () => {
			if (		
				(ball.x + halfBall > 151 - HalfBorderWidth &&
				ball.x - halfBall < 151 + HalfBorderWidth &&
				ball.y - halfBall < 130 + HalfBorderHeight &&
				ball.y + halfBall > 130 - HalfBorderHeight) ||

				(ball.x + halfBall > -151 - HalfBorderWidth &&
				ball.x - halfBall < -151 + HalfBorderWidth &&
				ball.y - halfBall < 130 + HalfBorderHeight &&
				ball.y + halfBall > 130 - HalfBorderHeight) ||

				(ball.x + halfBall > -151 - HalfBorderWidth &&
				ball.x - halfBall < -151 + HalfBorderWidth &&
				ball.y - halfBall < -130 + HalfBorderHeight &&
				ball.y + halfBall > -130 - HalfBorderHeight) ||

				(ball.x + halfBall > 151 - HalfBorderWidth &&
				ball.x - halfBall < 151  + HalfBorderWidth &&
				ball.y - halfBall < -130 + HalfBorderHeight &&
				ball.y + halfBall > -130 - HalfBorderHeight)
			)
				return (true)
			else
				return (false)
		}

		const isBorder2 = () => {
			if (
				(ball.x + halfBall > 130 - HalfBorderHeight && 
				ball.x - halfBall < 130 + HalfBorderHeight &&
				ball.y - halfBall < 151 + HalfBorderWidth &&
				ball.y + halfBall > 151 - HalfBorderWidth) ||

				
				(ball.x + halfBall > -130 - HalfBorderHeight &&
				ball.x - halfBall < -130 + HalfBorderHeight &&
				ball.y - halfBall < 151 + HalfBorderWidth &&
				ball.y + halfBall > 151 - HalfBorderWidth) || 


				(ball.x + halfBall > -130 - HalfBorderHeight &&
				ball.x - halfBall < -130 + HalfBorderHeight &&
				ball.y - halfBall < -151 + HalfBorderWidth &&
				ball.y + halfBall > -151 - HalfBorderWidth) ||


				(ball.x + halfBall > 130 - HalfBorderHeight && 
				ball.x - halfBall < 130 + HalfBorderHeight &&
				ball.y - halfBall < -151 + HalfBorderWidth &&
				ball.y + halfBall > -151 - HalfBorderWidth)
			)
				return (true)
			else
				return (false)
		}

		if (isBorder())
			ball.velocityX *= -1;
		else if (isBorder2())
			ball.velocityY *= -1;
		else if (isCollidingWithPaddle(leftPaddlePos))
			updateBall(leftPaddlePos, 1);
		else if (isCollidingWithPaddle(rightPaddlePos))
			updateBall(rightPaddlePos, -1);
		else if (isCollidingWithPaddle2(TopPaddlePos))
			updateBall2(TopPaddlePos, -1);
		else if (isCollidingWithPaddle2(BottomPaddlePos))
			updateBall2(BottomPaddlePos, 1);
		else if ((ball.x > 200 || ball.x < -200) && 
			props.p2Score !== 7 &&
			props.p1Score !== 7 &&
			props.p3Score !== 7 &&
			props.p4Score !== 7) {
			if (ball.x < -200)
				props.setP2Score(props.p2Score + 1);
			else if (ball.x > 200)
				props.setP1Score(props.p1Score + 1);
			else if (ball.y < -200)
				props.setP3Score(props.p3Score + 1);
			else if (ball.y > 200)
				props.setP4Score(props.p4Score + 1);
			if (props.p2Score === 6) {
				props.setGameOver(true);
				props.setWinner('P2');
				setVisibility(false);
				return
			}
			else if (props.p1Score === 6) {
				props.setGameOver(true);
				props.setWinner('P1');
				setVisibility(false);
				return
			}
			else if (props.p3Score === 6) {
				props.setGameOver(true);
				props.setWinner('P3');
				setVisibility(false);
				return
			}
			else if (props.p4Score === 6) {
				props.setGameOver(true);
				props.setWinner('P4');
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