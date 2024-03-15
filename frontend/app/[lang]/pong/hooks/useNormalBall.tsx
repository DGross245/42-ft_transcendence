import { useCallback, useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

import { usePongGameState } from "./usePongGameState";
import { usePongSocket } from "./usePongSocket";
import { Vector3 } from "three";
import * as THREE from "three"

export const useBall = (onPositionChange: (position: Vector3) => void) => {
	const {
		ballRef,
		scores,
		setWinner,
		setBallVisibility,
		updatePongGameState,
		pongGameState,
		leftPaddleRef,
		rightPaddleRef,
		isScoreVisible,
		setScores,
		started,
		isGameMode
	} = usePongGameState();
	const { wsclient, playerState, customized} = usePongSocket();
	const [moved, setMoved] = useState(false);
	const skipRef = useRef(false);
	const temp = useRef({ x: 0, z: 0, velocityX: 0, velocityZ: 0, speed: 0.1 });
	const halfPaddleWidth = 4 / 2;
	const halfPaddleHeight = 30 / 2;
	const halfBall = 2;
	let lastUpdate = performance.now();

	/**
	 * Changes the ball's direction after it collided with a paddle.
	 * @param paddlePos - the position of the paddle.
	 * 					  Contains 'x' and 'z' properties.
	 * @param direction - The direction (1 or -1) indicating the side of the paddle the ball collided with:
	 * 					  -  1: Collided with the left paddle.
	 * 					  - -1: Collided with the right paddle.
	 */
	const changeBallDir = (paddlePos: THREE.Vector3, direction: number) => {
		if (playerState.master || !skipRef.current) {
			const deltaZ = ballRef.current.position.z - paddlePos.z;
			const normalizedY = deltaZ / halfPaddleHeight;
		
			if (temp.current.speed <= 2) {
				temp.current.speed += 0.2;
			}
			const testX = direction * temp.current.speed;
			const testZ = normalizedY * temp.current.speed;
			temp.current.velocityX = testX
			temp.current.velocityZ = testZ
		
			if (playerState.master) {
				const msg = {
					position: { x: temp.current.x, z: temp.current.z },
					velocity: { x: testX, z: testZ },
					speed: temp.current.speed,
				}
				wsclient?.emitMessageToGame(JSON.stringify(msg), `changeBall-${pongGameState.gameId}`, pongGameState.gameId);
			}
		}
		skipRef.current = false;
	}

	useEffect(() => {
		if (pongGameState.gameOver && ballRef && ballRef.current) {
			temp.current.velocityX = 0
			temp.current.velocityZ = 0
			ballRef.current.position.x = 0;
			ballRef.current.position.z = 0;
		}
	},[pongGameState.gameOver, ballRef, pongGameState.gameId, wsclient]);

	/**
	 * Updates the new position of the ball based on its velocity and the time passed since last frame (deltaTime).
	 * @param ball - The ball object containing position and velocity properties.
	 * 				 Contains 'x', 'z', 'velocityX', and 'velocityZ' fields.
	 * @param deltaTime - The time passed since the last frame, in seconds.
	 * 					  Used to ensure independence from the frame rate.
	*/
	const randomBallDir = useCallback(() => {
		ballRef.current.position.x = 0;
		ballRef.current.position.z = 0;
		temp.current.speed = 1.2;

		const ranges = [
			{min: -37.5, max: 37.5},
			{min: 142.5, max: 218.5},
		];

		const { min, max } = ranges[Math.floor(Math.random() * ranges.length)];
		const angle = (Math.random() * (max - min) + min) * (Math.PI / 180);

		const newX = temp.current.speed * Math.sin(angle + (Math.PI / 2));
		const newZ = temp.current.speed * Math.cos(angle + (Math.PI / 2));
		if (!playerState.master && temp.current.velocityX === 0 && temp.current.velocityZ === 0){
			return ;
		}

		temp.current.velocityX = newX;
		temp.current.velocityZ = newZ;

		if (playerState.master) {
			const msg = {
				position: { x: 0, z: 0 },
				target:{ x: temp.current.x, z: temp.current.z },
				velocity: { x: newX, z: newZ },
				speed: 1.2
			}
			wsclient?.emitMessageToGame(JSON.stringify(msg), `ballUpdate-${pongGameState.gameId}`, pongGameState.gameId);
		}
	}, [ballRef, pongGameState.gameId, wsclient, playerState.master])

	useEffect(() => {
		const setNewScore = (msg: string) => {
			const newScore = JSON.parse(msg);
			if (!playerState.master) {
				if (isGameMode) {
					setScores((prevState) => ({
						...prevState,
						p1Score: newScore.p1Score,
						p2Score: newScore.p2Score,
						p3Score: newScore.p3Score,
						p4Score: newScore.p4Score
					}));
				} else {
					setScores((prevState) => ({
						...prevState,
						p1Score: newScore.p2Score,
						p2Score: newScore.p1Score
					}));
				}
			}
		};

		if (wsclient && pongGameState.gameId !== '-1') {
			wsclient?.addMessageListener(`ScoreUpdate-${pongGameState.gameId}`, pongGameState.gameId, setNewScore);
	
			return () => {
				wsclient?.removeMessageListener(`ScoreUpdate-${pongGameState.gameId}`, pongGameState.gameId);
			};
		}
	}, [wsclient, pongGameState.gameId, playerState.master, isGameMode, setScores]);

	/**
	 * Initiates the game by providing a random direction to the ball after the countdown 
	 * sets the score visibility to true.
	 */
	useEffect(() => {
		if ((started && customized) && !moved) {
			randomBallDir();
			setMoved(true);
		} else if ((!started || !customized) && moved) {
			setMoved(false);
		}
	}, [started, customized,moved, randomBallDir]);

	useEffect(() => {
		const checkWinner = (player: string, playerScore: number) => {
			if (playerScore === 7 && !pongGameState.gameOver) {
				ballRef.current.position.x = 0;
				ballRef.current.position.z = 0;
				temp.current.velocityX = 0;
				temp.current.velocityZ = 0;
				temp.current.speed = 0.1;
				updatePongGameState({ gameOver: true })
				setWinner(player);
				setBallVisibility(false);
			}
		}

		if (wsclient && pongGameState.gameId !== "-1" && playerState.master) {
			const newScore = {
				p1Score: scores.p1Score,
				p2Score: scores.p2Score
			}
			wsclient?.emitMessageToGame(JSON.stringify(newScore), `ScoreUpdate-${pongGameState.gameId}`, pongGameState.gameId);
		}

		if (playerState.client === 1 && playerState.master) {
			checkWinner('1', scores.p2Score);
			checkWinner('2', scores.p1Score);
		}
		checkWinner('1', playerState.master ? scores.p1Score : scores.p2Score);
		checkWinner('2', playerState.master ? scores.p2Score : scores.p1Score);
	}, [pongGameState.gameId, playerState.client, ballRef, pongGameState.gameOver, scores, wsclient, playerState.master, setWinner, setBallVisibility, updatePongGameState]);

	const calcNewPosition = (deltaTime: number) => {
		const deltaX = temp.current.velocityX * 200 * deltaTime;
		const deltaZ = temp.current.velocityZ * 200 * deltaTime;

		return {
			x: ballRef.current.position.x + deltaX, 
			z: ballRef.current.position.z + deltaZ,
		}
	}

	const updateBall = (deltaTime: number) => {
		if (pongGameState.pause || !isScoreVisible) return ;
		if (playerState.master) {
			const newPosition = calcNewPosition(deltaTime);
			temp.current.x = newPosition.x;
			temp.current.z = newPosition.z;
			ballRef.current.position.lerp(new THREE.Vector3(newPosition.x, 0, newPosition.z), 0.5)

			if (onPositionChange && ballRef.current) {
				onPositionChange(ballRef.current.position);
			}
		} else {
			const newPosition = calcNewPosition(deltaTime);
			ballRef.current.position.lerp(new THREE.Vector3(newPosition.x, 0, newPosition.z), 0.5)
		}
	}

	useEffect(() => {
		const setNewCoords = (msg: string) => {
			const newPosition = JSON.parse(msg);
			temp.current.velocityX = -newPosition.velocity.x;
			temp.current.velocityZ = newPosition.velocity.z;
			ballRef.current.position.x = -newPosition.position.x;
			ballRef.current.position.z = newPosition.position.z;
			temp.current.speed = newPosition.speed;
		};

		if (wsclient && pongGameState.gameId !== '-1' && !playerState.master) {
			wsclient?.addMessageListener(`ballUpdate-${pongGameState.gameId}`, pongGameState.gameId, setNewCoords);
	
			return () => {
				wsclient?.removeMessageListener(`ballUpdate-${pongGameState.gameId}`, pongGameState.gameId);
			};
		}
	}, [wsclient, pongGameState.gameId, ballRef, playerState.master]);

	useEffect(() => {
		const setNewCoords = (msg: string) => {
			const newPosition = JSON.parse(msg);
			skipRef.current = true;
			temp.current.velocityX = -newPosition.velocity.x;
			temp.current.velocityZ = newPosition.velocity.z;
			ballRef.current.position.x = -newPosition.position.x;
			ballRef.current.position.z = newPosition.position.z;
			temp.current.speed = newPosition.speed;
		};

		if (wsclient && pongGameState.gameId !== '-1' && !playerState.master) {
			wsclient?.addMessageListener(`changeBall-${pongGameState.gameId}`, pongGameState.gameId, setNewCoords);
	
			return () => {
				wsclient?.removeMessageListener(`changeBall-${pongGameState.gameId}`, pongGameState.gameId);
			};
		}
	}, [wsclient, pongGameState.gameId, ballRef, playerState.master]);

	// Master client send an update every 50 ms
	useFrame(() => {
		if (playerState.master) {
			const currentTime = performance.now();
			const timePast = currentTime - lastUpdate;
		
			if (timePast >= 1000) {
				const msg = {
					position:  { x: temp.current.x, z: temp.current.z },
					velocity: { x: temp.current.velocityX, z: temp.current.velocityZ },
					speed: temp.current.speed,
				}
				wsclient?.emitMessageToGame(JSON.stringify(msg), `ballUpdate-${pongGameState.gameId}`, pongGameState.gameId);
				lastUpdate = currentTime;
			}
		}
	});

	// Game/render loop for the ball.
	useFrame((_, deltaTime) => {
		if (pongGameState.pause) return ;

		updateBall(deltaTime);
		const isCollidingWithPaddleX = (paddle: { x: number; z: number; }) => {
			return (
				ballRef.current.position.x + halfBall + temp.current.velocityX > paddle.x - halfPaddleWidth &&
				ballRef.current.position.x - halfBall + temp.current.velocityX < paddle.x + halfPaddleWidth &&
				ballRef.current.position.z + halfBall > paddle.z - halfPaddleHeight &&
				ballRef.current.position.z - halfBall < paddle.z + halfPaddleHeight
			);
		}

		const isCollidingWithPaddleY = (paddle: { x: number; z: number; }) => {
			return (
				ballRef.current.position.x + halfBall > paddle.x - halfPaddleWidth &&
				ballRef.current.position.x - halfBall < paddle.x + halfPaddleWidth &&
				ballRef.current.position.z + halfBall + temp.current.velocityZ > paddle.z - halfPaddleHeight &&
				ballRef.current.position.z - halfBall + temp.current.velocityZ < paddle.z + halfPaddleHeight
			);
		}

		// Handling ball collision with top and bottom boarders.
		if (ballRef.current.position.z > 100 || ballRef.current.position.z < -100) {
			temp.current.velocityZ *= -1;
			updateBall(deltaTime);
		}
		// Handling ball collision with paddles.
		else if (isCollidingWithPaddleX(leftPaddleRef.current.position)) {
			changeBallDir(leftPaddleRef.current.position, 1);
		}
		else if (isCollidingWithPaddleX(rightPaddleRef.current.position)) {
			changeBallDir(rightPaddleRef.current.position, -1);
		}
		else if (isCollidingWithPaddleY(leftPaddleRef.current.position)) {
			changeBallDir(leftPaddleRef.current.position, 1);
		}
		else if (isCollidingWithPaddleY(rightPaddleRef.current.position)) {
			changeBallDir(rightPaddleRef.current.position, -1);
		}
		// Handling scoring when the ball is outside of the play area.
		else if ((ballRef.current.position.x > 200 || ballRef.current.position.x < -200) && 
			scores.p2Score !== 7 && scores.p1Score !== 7 && playerState.master) {
			if (playerState.master) {
				if (ballRef.current.position.x < -200) {
					setScores({ ...scores, p2Score: scores.p2Score + 1 })
				} else {
					setScores({ ...scores, p1Score: scores.p1Score + 1 })
				}
			}
			randomBallDir();
		}
	});
}