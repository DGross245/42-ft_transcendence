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

type CollisionInfo = {
	[key: string]: {score: any, setScore: any, isOwnGoal: boolean};
};

const Ball = (props) => {
	let ref = useRef<BallElement>();
	const ballRef = useRef({ x: 0, y: 0, velocityX: 0, velocityY: 0, speed: 0.1 });
	const halfBall = 2;
	let lastPaddleHit = '';

	const changeBallDir = (paddlePos: { x: number; y: number}, direction: number, isHorizontal: boolean) => {
		let ball = ballRef.current;
		const delta = isHorizontal ? ball.x - paddlePos.x : ball.y - paddlePos.y;
		const normalized = delta / 15;

		if (ball.speed <= 2)
			ball.speed += 0.2;
		ball.velocityX = isHorizontal ? normalized * ball.speed : direction * ball.speed;
		ball.velocityY = isHorizontal ? direction * ball.speed : normalized * ball.speed;
	}

	const randomBallDir = () => {
		let ball = ballRef.current;
		ball.x = 0;
		ball.y = 0;
		ball.speed = 1.2;

		const ranges = [
			{min: -37.5, max: 37.5},
			{min:  52.5, max: 127.5},
			{min: 142.5, max: 218.5},
			{min: 232.5, max: 308.5},
		];

		const { min, max } = ranges[Math.floor(Math.random() * ranges.length)];
		const angle = (Math.random() * (max - min) + min) * (Math.PI / 180);

		ball.velocityX = ball.speed * Math.sin(angle);
		ball.velocityY = ball.speed * Math.cos(angle);
	}

	const handleScore = (ball: { x: number; y: number; }) => {
		const paddleCollision: CollisionInfo = {
			left:   { score: props.p1Score, setScore: props.setP1Score, isOwnGoal: ball.x <= -200 ? true : false },
			right:  { score: props.p2Score, setScore: props.setP2Score, isOwnGoal: ball.x >= 200 ? true : false },
			top:    { score: props.p3Score, setScore: props.setP3Score, isOwnGoal: ball.y >= 200 ? true : false },
			bottom: { score: props.p4Score, setScore: props.setP4Score, isOwnGoal: ball.y <= -200 ? true : false },
		}

		if (lastPaddleHit !== '') {
			const { score, setScore, isOwnGoal } = paddleCollision[lastPaddleHit];

			if (isOwnGoal && score !== 0)
				setScore(score - 1);
			else if (!isOwnGoal)
				setScore(score + 1);

		} else {
			if (ball.x <= -200 && props.p1Score !== 0 )
				props.setP1Score(props.p1Score - 1);
			else if (ball.x >= 200 && props.p2Score !== 0)
				props.setP2Score(props.p2Score - 1);
			else if (ball.y >= 200 && props.p3Score !== 0)
				props.setP3Score(props.p3Score - 1);
			else if (ball.y <= -200 && props.p4Score !== 0)
				props.setP4Score(props.p4Score - 1);
		}
		lastPaddleHit = '';
	}

	const updateBallPosition = (ball: { x: number; y: number; velocityX: number; velocityY: number; }, deltaTime: number) => {
		ball.x += ball.velocityX * 100 * deltaTime;
		ball.y += ball.velocityY * 100 * deltaTime;
		ref.current!.position.x = ball.x;
		ref.current!.position.y = ball.y;
	}

	const handleBallMovement = (ball: { x: any; y: any; velocityX: any; velocityY: any; speed: number; }, deltaTime: number) => {
		const rightPaddlePos = props.rightPaddleRef.current.position;
		const leftPaddlePos = props.leftPaddleRef.current.position;
		const TopPaddlePos = props.topPaddleRef.current.position;
		const BottomPaddlePos = props.bottomPaddleRef.current.position;

		const isColliding = ( x: number, y: number, width: number, height: number) => {
			return (
				ball.x + halfBall >= x - width &&
				ball.x - halfBall <= x + width &&
				ball.y - halfBall <= y + height &&
				ball.y + halfBall >= y - height
			);
		}

		// Handle collision with the vertical walls
		if (isColliding(-151, 131, 2, 20) || isColliding(151, 131, 2, 20) ||
			isColliding(-151, -131, 2, 20) || isColliding(151, -131, 2, 20)) {
			if (ball.x + halfBall >= 151 || ball.x - halfBall <= -151)
				ball.velocityY *= -1;
			else
				ball.velocityX *= -1;
			updateBallPosition(ball, deltaTime);
		}
		// Handle collision with the horizontal walls
		if (isColliding(-131, 151, 20, 2) || isColliding(131, 151, 20, 2)||
			isColliding(-131, -151, 20, 2) || isColliding(131, -151, 20, 2)) {
			if (ball.y + halfBall >= 151 || ball.y - halfBall <= -151)
				ball.velocityX *= -1;
			else
				ball.velocityY *= -1;
			updateBallPosition(ball, deltaTime);
		}
		else if (isColliding(leftPaddlePos.x, leftPaddlePos.y, 2, 15)) {
			lastPaddleHit = 'left';
			changeBallDir(leftPaddlePos, 1, false);
		}
		else if (isColliding(rightPaddlePos.x, rightPaddlePos.y, 2, 15)) {
			lastPaddleHit = 'right';
			changeBallDir(rightPaddlePos, -1, false);
		}
		else if (isColliding(TopPaddlePos.x, TopPaddlePos.y, 15, 2)) {
			lastPaddleHit = 'top';
			changeBallDir(TopPaddlePos, -1, true);
		}
		else if (isColliding(BottomPaddlePos.x, BottomPaddlePos.y, 15, 2)) {
			lastPaddleHit = 'bottom';
			changeBallDir(BottomPaddlePos, 1, true);
		}
		else if (( ball.x <= -200 || ball.x >= 200 || ball.y >= 200 || ball.y <= -200) && 
			props.p1Score !== 7 && props.p2Score !== 7 && props.p3Score !== 7 && props.p4Score !== 7) {
			handleScore(ball);
			randomBallDir();
		}
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
				props.setGameOver(true);
				props.setWinner(player);
				let ball = ballRef.current;
				ball.x = 0;
				ball.y = 0;
				ball.velocityX = 0;
				ball.velocityY = 0;
				ball.speed = 0.1;
				props.setBallVisibility(false);
			}
		}

		checkWinner('P1', props.p1Score);
		checkWinner('P2', props.p2Score);
		checkWinner('P3', props.p3Score);
		checkWinner('P4', props.p4Score);
	}, [props.p1Score, props.p2Score, props.p3Score, props.p4Score]);

	// Game/Render loop
	useFrame((state, deltaTime) => {
		let ball = ballRef.current;

		updateBallPosition(ball, deltaTime);
		handleBallMovement(ball, deltaTime); 
	});

	return (
		<mesh ref={ref} visible={props.isBallVisible}>
			<boxGeometry args={[4, 4, 4]} />
			<meshBasicMaterial color={new THREE.Color(16, 16, 16)}/>
		</mesh>
	);
}

export default Ball;