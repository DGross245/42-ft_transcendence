'use client'

import { useEffect, useRef, useState } from "react";
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BottomPaddle, TopPaddle } from "./Paddle";

// FIXME: Fix the edge logic (if the ball hits the edge it speeds up too fast)
// FIXME: broder have still problems when the ball hits them on the edges
// FIXME: Ball feels laggy some times even with 60 fps
// FIXME: Ball direction can be bit shitty like when veloX/Y are both 1

const Ball = (props) => {
	let ref = useRef();
	const [isVisible, setVisibility] = useState(true);
	const ballRef = useRef({ x: 0, y: 0, velocityX: 0, velocityY: 0, speed: 2 });
	const halfPaddleWidth = 4 / 2;
	const HalfPaddleHeight = 30 / 2;
	const HalfBorderHeight = 40 / 2;
	const HalfBorderWidth = 4 / 2;
	const halfBall = 2;
	let lastToutched = '';

	const updateBall = (paddlePos, direction) => {
		const ball = ballRef.current;
		const deltaY = ball.y - paddlePos.y;
		const normalizedY = deltaY / HalfPaddleHeight;

		if (ball.speed <= 4)
			ball.speed += 0.2;
		ball.velocityX = direction * ball.speed;
		ball.velocityY = normalizedY * ball.speed;
	}

	const updateBall2 = (paddlePos, direction) => {
		const ball = ballRef.current;
		const deltaX = ball.x - paddlePos.x;
		const normalizedX = deltaX / HalfPaddleHeight;

		if (ball.speed <= 4)
			ball.speed += 0.2;
		ball.velocityX = normalizedX * ball.speed;
		ball.velocityY = direction * ball.speed;
	}

	const randomBallDir = () => {
		const ball = ballRef.current;
		ball.x = 0;
		ball.y = 0;
	
		let randomNumber = Math.random();
		let angle = 360 * randomNumber;
		ball.speed = 2;

		ball.velocityX = ball.speed * Math.sin(angle);
		ball.velocityY = ball.speed * Math.cos(angle);
	}

	useEffect(() => {
		if (props.ScoreVisible){
			randomBallDir();
		}
	}, [props.ScoreVisible]);

	useEffect(() => {
		if (props.p1Score === 7) {
			props.setGameOver(true);
			props.setWinner('P1');
			setVisibility(false);
			return
		}
		else if (props.p2Score === 7) {
			props.setGameOver(true);
			props.setWinner('P2');
			setVisibility(false);
			return
		}
		else if (props.p3Score === 7) {
			props.setGameOver(true);
			props.setWinner('P3');
			setVisibility(false);
			return
		}
		else if (props.p4Score === 7) {
			props.setGameOver(true);
			props.setWinner('P4');
			setVisibility(false);
			return
		}
	}, [props.p1Score, props.p2Score, props.p3Score, props.p4Score]);

	useFrame(() => {
		console.log(lastToutched);
		const ball = ballRef.current;
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
		else if (isCollidingWithPaddle(leftPaddlePos)) {
			lastToutched = 'left';
			updateBall(leftPaddlePos, 1);
		}
		else if (isCollidingWithPaddle(rightPaddlePos)) {
			lastToutched = 'right';
			updateBall(rightPaddlePos, -1);
		}
		else if (isCollidingWithPaddle2(TopPaddlePos)) {
			lastToutched = 'top';
			updateBall2(TopPaddlePos, -1);
		}
		else if (isCollidingWithPaddle2(BottomPaddlePos)) {
			lastToutched = 'bottom';
			updateBall2(BottomPaddlePos, 1);
		}
		else if ((ball.x > 200 || ball.x < -200 || ball.y > 200 || ball.y < -200) && 
			props.p2Score !== 7 &&
			props.p1Score !== 7 &&
			props.p3Score !== 7 &&
			props.p4Score !== 7) {
	
			if (lastToutched === 'left') {
				if (ball.x < -200 && props.p1Score !== 0)
					props.setP1Score(props.p1Score - 1);
				else
					props.setP1Score(props.p1Score + 1);
			}
			else if (lastToutched === 'right') {
				if (ball.x > 200 && props.p2Score !== 0)
					props.setP2Score(props.p2Score - 1);
				else
					props.setP2Score(props.p2Score + 1);
			}
			else if (lastToutched === 'top') {
				if (ball.y > 200 && props.p3Score !== 0)
					props.setP3Score(props.p3Score - 1);
				else
					props.setP3Score(props.p3Score + 1);
			}
			else if (lastToutched === 'bottom') {
				if (ball.y < -200 && props.p4Score !== 0)
					props.setP4Score(props.p4Score - 1);
				else
					props.setP4Score(props.p4Score + 1);
			}
			if (lastToutched === '') {
				if (ball.x < -200 && props.p1Score !== 0 )
					props.setP1Score(props.p1Score - 1);
				else if (ball.x > 200 && props.p2Score !== 0)
					props.setP2Score(props.p2Score - 1);
				else if (ball.y > 200 && props.p3Score !== 0)
					props.setP3Score(props.p3Score - 1);
				else if (ball.y < -200 && props.p4Score !== 0)
					props.setP4Score(props.p4Score - 1);
			}
			randomBallDir();
			lastToutched = '';
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