import { useFrame } from "@react-three/fiber";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Mesh, MeshBasicMaterial, Vector3 } from 'three'

import { usePongGameState } from "./usePongGameState";
import { usePongSocket } from "./usePongSocket";

type CollisionInfo = {
	[key: string]: {player: any, score: any, isOwnGoal: boolean};
};

export const useBallLogic = (onPositionChange: (position: Vector3) => void) => {
	const {
		ballRef,
		scores,
		setWinner,
		setBallVisibility,
		updatePongGameState,
		pongGameState,
		isScoreVisible,
		bottomPaddleRef,
		leftPaddleRef,
		rightPaddleRef,
		topPaddleRef,
		setScores,
		botState
	} = usePongGameState();
	const { wsclient, playerState } = usePongSocket();

	const [color, setColor] = useState( 0xffffff );
	const [lastPaddleHit, setLastPaddleHit] = useState('');
	const temp = useRef({ x: 0, z: 0, velocityX: 0, velocityZ: 0, speed: 0.1 });
	const PositionRef = useRef({position: {x:0, z:0}, velocity: {x:0, z:0}, deltaTime: 0});
	const halfBall = 2;

	/**
	 * Changes the ball's direction after it collided with a paddle.
	 * @param paddlePos - the position of the paddle.
	 * 					  Contains 'x' and 'z' properties.
	 * @param direction - The direction (1 or -1) indicating the side of the paddle it collided with:
	 * 					  1: Collided with the left paddle.
	 * 					 -1: Collided with the right paddle.
	 * @param isHorizontal - A boolean indicating if the collision is with a horizontal (true) or vertical (false) oriented paddle.
	 * 						 If true, the collision is considered in the horizontal axis; if false, in the vertical axis.
	 */
	const changeBallDir = (paddlePos: { x: number; z: number}, direction: number, isHorizontal: boolean) => {
		let ball = temp.current;
		const delta = isHorizontal ? ball.x - paddlePos.x : ball.z - paddlePos.z;
		const normalized = delta / 15;

		if (ball.speed <= 2)
			ball.speed += 0.2;
		ball.velocityX = isHorizontal ? normalized * ball.speed : direction * ball.speed;
		ball.velocityZ = isHorizontal ? direction * ball.speed : normalized * ball.speed;
	}

	const changeColor = ( ref: MutableRefObject<Mesh>) => {
		if (ref && ref.current) {
			const material = ref.current.material as MeshBasicMaterial;
			const currentColor = material.color.getHex();
			setColor(currentColor);
		}
	}

	/**
	 * Sets the ball back to the middle and generates a random direction for the ball.
	 * It randomly takes one specified range and calculates with it a angle to determin the ball's direction.
	 */
	const randomBallDir = () => {
		let ball = temp.current;
		ball.x = 0;
		ball.z = 0;
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
		ball.velocityZ = ball.speed * Math.cos(angle);
	}

	/**
	 * Updates the scores based on the ball's position and the last paddle hit.
	 * Determines if a player loses a point or gains a point based on the ball's position
	 * relative to the paddles. If the player hits its own goal (lastPaddleHit = player), the player loses a point;
	 * otherwise, the player scores a point.
	 * @param ball - An object representing the position of the ball with 'x' and 'z' properties.
	 */
	const handleScore = (ball: { x: number; z: number; }) => {
		const paddleCollision: CollisionInfo = {
			bottom: { player: 'p1Score', score: scores.p1Score, isOwnGoal: ball.z >= 170 ? true : false },
			left:   { player: 'p2Score', score: scores.p2Score, isOwnGoal: ball.x <= -170 ? true : false },
			top:    { player: 'p3Score', score: scores.p3Score, isOwnGoal: ball.z <= -170 ? true : false },
			right:  { player: 'p4Score', score: scores.p4Score, isOwnGoal: ball.x >= 170 ? true : false },
		}

		if (lastPaddleHit !== '') {
			const { player, score, isOwnGoal } = paddleCollision[lastPaddleHit];
			if (isOwnGoal && score !== 0) {
				setScores({ ...scores, [player]: score - 1})
			}
			else if (!isOwnGoal) {
				setScores({ ...scores, [player]: score + 1})
			}

		} else {
			if (ball.z >= 170 && scores.p1Score !== 0) {
				setScores({ ...scores, p1Score: scores.p1Score - 1 })
			} else if (ball.x <= -170 && scores.p2Score !== 0 ) {
				setScores({ ...scores, p2Score: scores.p2Score - 1 })
			} else if (ball.z <= -170 && scores.p3Score !== 0) {
				setScores({ ...scores, p3Score: scores.p3Score - 1 })
			} else if (ball.x >= 170 && scores.p4Score !== 0) {
				setScores({ ...scores, p4Score: scores.p4Score - 1 })
			}
		}
		setLastPaddleHit('');
	}

	/**
	 * Updates the new position of the ball based on its velocity and the time passed since last frame (deltaTime).
	 * @param ball - The ball object containing position and velocity properties.
	 * 				 Contains 'x', 'z', 'velocityX', and 'velocityZ' fields.
	 * @param deltaTime - The time passed since the last frame, in seconds.
	 * 					  Used to ensure independence from the frame rate.
	 */
	const updateBallPosition = (ball: { x: number; z: number; velocityX: number; velocityZ: number; }, deltaTime: number) => {
		if (pongGameState.pause) {
			return ;
		}

		if (playerState.master) {
			ball.x += ball.velocityX * 100 * deltaTime;
			ball.z += ball.velocityZ * 100 * deltaTime;
			const msg = { 
				position: { x: ball.x, z: ball.z },
				velocity: { x: ball.velocityX, z: ball.velocityZ },
				deltaTime: deltaTime
			}
			wsclient?.emitMessageToGame(JSON.stringify(msg), `ballUpdate-${pongGameState.gameId}`, pongGameState.gameId);
		} else {
			const { position, velocity, deltaTime } = PositionRef.current;
			ball.x = position.x + velocity.x * deltaTime;
			ball.z = position.z + velocity.z * deltaTime;
		}

		if (ballRef.current) {
			ballRef.current.position.x = ball.x;
			ballRef.current.position.z = ball.z;
		}

		if (botState.isActive && onPositionChange && ballRef.current) {
			onPositionChange(ballRef.current.position);
		}
	}

	useEffect(() => {
		const setNewCoords = (msg: string) => {
			const newPosition = JSON.parse(msg);
			PositionRef.current = newPosition;
		};

		if (wsclient && pongGameState.gameId !== "-1") {
			wsclient?.addMessageListener(`ballUpdate-${pongGameState.gameId}`, pongGameState.gameId, setNewCoords);

			return () => {
				wsclient?.removeMessageListener(`ballUpdate-${pongGameState.gameId}`, pongGameState.gameId);
			};
		}
	}, [wsclient, pongGameState.gameId]);

	const handleBallMovement = (ball: { x: any; z: any; velocityX: any; velocityZ: any; speed: number; }, deltaTime: number) => {

		const rightPaddlePos = rightPaddleRef.current ? rightPaddleRef.current.position: {x:0, y:0, z:0};
		const leftPaddlePos = leftPaddleRef.current ? leftPaddleRef.current.position : {x:0, y:0, z:0};
		const TopPaddlePos = topPaddleRef.current ? topPaddleRef.current.position : {x:0, y:0, z:0};
		const BottomPaddlePos = bottomPaddleRef.current ? bottomPaddleRef.current.position : {x:0, y:0, z:0};

		/**
		 * The function checks if a ball is colliding with a rectangle given its position, width, and height.
		 * @param x - The x-coordinate of the object you want to check.
		 * @param z - The z-coordinate of the object you want to check.
		 * @param width - The width of the object you are checking.
		 * @param height - The height of the object you are checking.
		 * @returns a boolean value determing a hit or not.
		 */
		const isColliding = ( x: number, z: number, width: number, height: number) => {
			return (
				ball.x + halfBall >= x - width &&
				ball.x - halfBall <= x + width &&
				ball.z - halfBall <= z + height &&
				ball.z + halfBall >= z - height
			);
		}

		// Handle collision with the vertical walls.
		if (isColliding(-151, -131, 2, 20) || isColliding(151, -131, 2, 20) ||
			isColliding(-151, 131, 2, 20) || isColliding(151, 131, 2, 20)) {
			// Handling top or bottom side collision trajectory.
			if (ball.x + halfBall >= 151 || ball.x - halfBall <= -151) {
				ball.velocityZ *= -1;
			} else {
				// Normal collition trajectory.
				ball.velocityX *= -1;
				updateBallPosition(ball, deltaTime);
			}
		}
		// Handle collision with the horizontal walls.
		if (isColliding(-131, -151, 20, 2) || isColliding(131, -151, 20, 2)||
			isColliding(-131, 151, 20, 2) || isColliding(131, 151, 20, 2)) {
			// Handling left and right side collision.
			if (ball.z + halfBall >= 151 || ball.z - halfBall <= -151) {
				ball.velocityX *= -1;
			} else {
				// Normal collition trajectory.
				ball.velocityZ *= -1;
				updateBallPosition(ball, deltaTime);
			}
		}
		// Handling ball collision with paddles.
		else if (isColliding(leftPaddlePos.x, leftPaddlePos.z, 2, 15)) {
			setLastPaddleHit('left');
			changeBallDir(leftPaddlePos, 1, false);
			changeColor(leftPaddleRef);
		} else if (isColliding(rightPaddlePos.x, rightPaddlePos.z, 2, 15)) {
			setLastPaddleHit('right');
			changeBallDir(rightPaddlePos, -1, false);
			changeColor(rightPaddleRef);
		} else if (isColliding(TopPaddlePos.x, TopPaddlePos.z, 15, 2)) {
			setLastPaddleHit('top');
			changeBallDir(TopPaddlePos, 1, true);
			changeColor(topPaddleRef);
		} else if (isColliding(BottomPaddlePos.x, BottomPaddlePos.z, 15, 2)) {
			setLastPaddleHit('bottom');
			changeBallDir(BottomPaddlePos, -1, true);
			changeColor(bottomPaddleRef);
		}
		// Handling scoring when the ball is outside of the play area.
		else if (( ball.x <= -170 || ball.x >= 170 || ball.z >= 170 || ball.z <= -170) && 
		scores.p1Score !== 7 && scores.p2Score !== 7 && scores.p3Score !== 7 && scores.p4Score !== 7) {
			handleScore(ball);
			randomBallDir();
			setColor( 0xffffff );
		}
	}

	// Initiates the game by providing a random direction to the ball after the countdown
	// sets the score visibility to true.
	useEffect(() => {
		if (isScoreVisible) {
			randomBallDir();
		}
	}, [isScoreVisible]);

	useEffect(() => {
		const checkWinner = (player: string, playerScore: number) => {
			if (playerScore === 7) {
				updatePongGameState({ gameOver: true });
				setWinner(player);
				let ball = temp.current;
				ball.x = 0;
				ball.z = 0;
				ball.velocityX = 0;
				ball.velocityZ = 0;
				ball.speed = 0.1;
				setBallVisibility(false);
			}
		}

		checkWinner('P1', scores.p1Score);
		checkWinner('P2', scores.p2Score);
		checkWinner('P3', scores.p3Score);
		checkWinner('P4', scores.p4Score);
	}, [scores.p1Score, scores.p2Score, scores.p3Score, scores.p4Score, setBallVisibility, setWinner, updatePongGameState]);

	// Game/render loop for the ball.
	useFrame((_, deltaTime) => {
		let ball = temp.current;

		updateBallPosition(ball, deltaTime);
		handleBallMovement(ball, deltaTime); 
	});

	return { color };
}