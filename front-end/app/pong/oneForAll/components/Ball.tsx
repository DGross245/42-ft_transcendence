'use client'

import { useEffect, useRef, useState } from "react";
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// FIXME: Fix the edge logic (if the ball hits the edge it speeds up too fast)
// FIXME: Ball feels laggy some times even with 60 fps
// FIXME: Ball direction can be bit shitty like when veloX/Y are both 1
// FIXME: something wrong with the walls

const Ball = (props) => {
	let ref = useRef();
	const [isVisible, setVisibility] = useState(true);
	const ballRef = useRef({ x: 0, y: 0, velocityX: 0, velocityY: 0, speed: 0.1 });
	const halfBall = 2;
	let lastToutched = '';

	const updateBall = (paddlePos: { y: number; }, direction: number) => {
		let ball = ballRef.current;
		const deltaY = ball.y - paddlePos.y;
		const normalizedY = deltaY / 15;

		if (ball.speed <= 4)
			ball.speed += 0.2;
		ball.velocityX = direction * ball.speed;
		ball.velocityY = normalizedY * ball.speed;
	}

	const updateBall2 = (paddlePos: { x: number; }, direction: number) => {
		let ball = ballRef.current;
		const deltaX = ball.x - paddlePos.x;
		const normalizedX = deltaX / 15;

		if (ball.speed <= 4)
			ball.speed += 0.2;
		ball.velocityX = normalizedX * ball.speed;
		ball.velocityY = direction * ball.speed;
	}

	const randomBallDir = () => {
		let ball = ballRef.current;
		ball.x = 0;
		ball.y = 0;
	
		let randomNumber = Math.random();
		let angle = 360 * randomNumber;
		ball.speed = 2;

		ball.velocityX = ball.speed * Math.sin(angle);
		ball.velocityY = ball.speed * Math.cos(angle);

		// ball.velocityX = 1
		// ball.velocityY = 1.35
	}

	useEffect(() => {
		if (props.ScoreVisible){
			randomBallDir();
		}
	}, [props.ScoreVisible]);

	useEffect(() => {
		const checkWinner = (player: string, playerScore: number) => {
			if (playerScore === 7) {
				props.setGameOver(true);
				props.setWinner(player);
				setVisibility(false);
			}
		} 

		checkWinner('P1', props.p1Score);
		checkWinner('P2', props.p2Score);
		checkWinner('P3', props.p3Score);
		checkWinner('P4', props.p4Score);

	}, [props.p1Score, props.p2Score, props.p3Score, props.p4Score]);

	// let currentTime = performance.now();

	useFrame(() => {
		// const newTime = performance.now();

		// const deltaTime = (newTime - currentTime);
		// currentTime = newTime;
	
		let ball = ballRef.current;
		// ball.x += ball.velocityX * 0.1 * deltaTime;
		// ball.y += ball.velocityY * 0.1 * deltaTime;
		ball.x += ball.velocityX;
		ball.y += ball.velocityY;
		ref.current.position.x = ball.x;
		ref.current.position.y = ball.y;
		const rightPaddlePos = props.rightPaddleRef.current.position;
		const leftPaddlePos = props.leftPaddleRef.current.position;
		const TopPaddlePos = props.topPaddleRef.current.position;
		const BottomPaddlePos = props.bottomPaddleRef.current.position;
	
		const isCollidingWithPaddle = (paddle: { x: number; y: number; }, halfPaddleWidth: number, HalfPaddleHeight: number) => {
			return (
				ball.x + halfBall >= paddle.x - halfPaddleWidth &&
				ball.x - halfBall <= paddle.x + halfPaddleWidth &&
				ball.y - halfBall <= paddle.y + HalfPaddleHeight &&
				ball.y + halfBall >= paddle.y - HalfPaddleHeight
			);
		}

		const isCollidingWithBorder = ( borderX: number, borderY: number, HalfBorderWidth: number, HalfBorderHeight: number) => {
			return (
				ball.x + halfBall >= borderX - HalfBorderWidth &&
				ball.x - halfBall <= borderX + HalfBorderWidth &&
				ball.y - halfBall <= borderY + HalfBorderHeight &&
				ball.y + halfBall >= borderY - HalfBorderHeight
			);
		}

		if (isCollidingWithBorder(151, 131, 2, 20) ||
			isCollidingWithBorder(-151, 131, 2, 20) ||
			isCollidingWithBorder(-151, -131, 2, 20) || 
			isCollidingWithBorder(151, -131, 2, 20)) {
			if (ball.x + halfBall >= 151 || ball.x - halfBall <= -151)
				ball.velocityY *= -1;
			else
				ball.velocityX *= -1;
		}
		if (isCollidingWithBorder(131, 151, 20, 2) ||
			isCollidingWithBorder(-131, 151, 20, 2) ||
			isCollidingWithBorder(-131, -151, 20, 2) ||
			isCollidingWithBorder(131, -151, 20, 2)) {
			if (ball.y + halfBall >= 151 || ball.y - halfBall <= -151)
				ball.velocityX *= -1;
			else
				ball.velocityY *= -1;
		}
		else if (isCollidingWithPaddle(leftPaddlePos, 2, 15)) {
			lastToutched = 'left';
			updateBall(leftPaddlePos, 1);
		}
		else if (isCollidingWithPaddle(rightPaddlePos, 2, 15)) {
			lastToutched = 'right';
			updateBall(rightPaddlePos, -1);
		}
		else if (isCollidingWithPaddle(TopPaddlePos, 15, 2)) {
			lastToutched = 'top';
			updateBall2(TopPaddlePos, -1);
		}
		else if (isCollidingWithPaddle(BottomPaddlePos, 15, 2)) {
			lastToutched = 'bottom';
			updateBall2(BottomPaddlePos, 1);
		}
		else if ((ball.x > 200 || ball.x < -200 || ball.y > 200 || ball.y < -200) && 
			props.p2Score !== 7 && props.p1Score !== 7 && props.p3Score !== 7 && props.p4Score !== 7) {
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
			/>
		</mesh>
	);
}

export default Ball;