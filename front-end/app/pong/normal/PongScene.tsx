"use client"

import React, { MutableRefObject, useContext, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei'; 
import Camera from '../sharedComponents/Camera';
import Border from './components/Border';
import { RightPaddle, LeftPaddle } from './components/Paddle';
import { Ball } from './components/Ball';
import CubeLine from './components/CubeLine';
import Scoreboard from './components/Scoreboard';
import EndModal from './components/EndModal';
import Countdown from '../sharedComponents/Countdown';
import inputHandler from '@/components/inputHandler';
import { Mesh } from 'three'
import { PongContext } from './PongProvider';
import useWSClient from '@/helpers/wsclient';
import { useGameState } from './components/GameState';

// TODO: ADD Paus screen for handling disconnections/pausing etc..
// TODO: Matchmaking, should handle the sockets and joining for games, at setting player info

// TODO: maybe move all Game related handler to another component for handling all inportant changes like reset, paus etc.
// FIXME: Someotimes the guest or not host, counts the score twice

/**
 * The PongScene component is a Three.js scene representing a Pong game that includes various elements such as paddles,
 * ball, borders, camera, countdown, scoreboard, and a modal for displaying the winner.
 * @returns The entire Three.js scene, including the modal.
 */
export default function PongScene(/* maybe get gameId as param */) { // PlayerState needs to set too
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
	const [p1Score, setP1Score] = useState(0);
	const [p2Score, setP2Score] = useState(0);
	const [showModal, setShowModal] = useState(false);
	const [winner, setWinner] = useState('');
	const [gameOver, setGameOver] = useState(false);
	const [scoreVisible, setScoreVisibility] = useState(false);
	const [reset, setReset] = useState(false);
	const [isBallVisible, setBallVisibility] = useState(true)
	const keyMap = inputHandler();

	const wsClient = useWSClient(); // FIXME: Move to somewhere else

	const rightPaddleRef = useRef<Mesh>(null) as MutableRefObject<Mesh>;
	const leftPaddleRef = useRef<Mesh>(null) as MutableRefObject<Mesh>;
	const ballRef = useRef<Mesh>(null);

	const closeModal = () => {
		setShowModal(false);
	}

	const openModal = () => {
		setShowModal(true);
	}

	const { gameState, updateGameState, playerState, updatePlayerState } = useContext(PongContext);

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	useEffect(() => {
		const waitForSocket = async () => {
			if (wsClient) {
				await wsClient.waitingForSocket();
				updateGameState({ ...gameState, gameId: "1", wsclient: wsClient });
			}
		};

		waitForSocket();
	}, [wsClient]);

	useEffect(() => {
		const joinTheGame = async () => {
			if (gameState.wsclient) {
				const clients =  await gameState.wsclient.joinGame(gameState.gameId);
				if (clients === 1) {
					const newPlayerState = {
						...playerState,
						master: true,
					}
					updatePlayerState(newPlayerState);
				}
			}
		};

		console.log(gameState, playerState.master);
		joinTheGame();
	}, [gameState.wsclient]);


	useEffect(() => {
		if (gameState.wsclient) {
			const setPause = (msg: string) => {
				if (msg === "2") {
					updateGameState({ ...gameState, pause: false });
				}
			};
			gameState.wsclient?.addMessageListener(`Players-${gameState.gameId}`, gameState.gameId, setPause)
		
			return () => {
				gameState.wsclient?.removeMessageListener(`Players-${gameState.gameId}`, gameState.gameId);
			} 
		}
	}, [gameState.wsclient]);

	// useEffect(() => {
	// 	if (gameState.wsclient) {
	// 		const setPause = (msg: string) => {
	// 			if (msg === "true")
	// 				updateGameState({ ...gameState, pause: true });
	// 		};
	// 		gameState.wsclient?.addMessageListener(`Pause-${gameState.gameId}`, gameState.gameId, setPause)
		
	// 		return () => {
	// 			gameState.wsclient?.removeMessageListener(`Pause-${gameState.gameId}`, gameState.gameId);
	// 		} 
	// 	}
	// }, [gameState.wsclient]);

	// useEffect(() => {
	// 	if (gameState.wsclient) {
	// 		if (keyMap['Escape']) {
	// 			console.log("Send Pause to opponent");
	// 			updateGameState({ ...gameState, pause: true })
	// 			gameState.wsclient?.emitMessageToGame("true", `Pause-${gameState.gameId}`, gameState.gameId);
	// 		}
	// 	}
	// }, [keyMap, gameState.wsclient]);
	
	useEffect(() => {
		if (gameState.wsclient) {
			console.log("Adding message listener for disconnecting player");
			const endGame = (msg: string) => {
				console.log("PLayer disconnected")
				setGameOver(true);
			};
			
			gameState.wsclient?.addMessageListener(`player-disconnected-${gameState.gameId}`, gameState.gameId, endGame)
			
			return () => {
				gameState.wsclient?.removeMessageListener(`player-disconnected-${gameState.gameId}`, gameState.gameId);
			}
		}
	}, [gameState.wsclient]);

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// Handles the reset of the scene when the 'reset' state changes.
	useEffect(() => {
		if (reset) {
			setBallVisibility(true);
			setGameOver(false);
			closeModal();
			setReset(false);
			setP1Score(0);
			setP2Score(0);
			setWinner('');
			setScoreVisibility(false);
		}
	}, [reset]);

	// Opens the EndModal after a delay if the 'gameOver' state is true.
	useEffect(() => {
		if (gameOver) {
			const delay = 1000;
			const modalTimeout = setTimeout(() => {
				openModal();
			}, delay);

			return (() => {
				clearTimeout(modalTimeout)
			});
		}
	}, [gameOver]);


	// Updates window dimensions on window resizing.
	useEffect(() => {
		const handleResize = () => {
			setDimensions({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		handleResize();

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return (
		<div style={{ width: '100%', height: '100%' }}>
			<Canvas style={{ width: dimensions.width, height: dimensions.height }}>
				<Countdown scoreVisible={scoreVisible} setScoreVisibility={setScoreVisibility} rotation={[0, 0, 0]} />
				<Camera position={[0, -100, 300]} keyMap={keyMap} />
				<Border position={[0,105,0]} />
				<Border position={[0,-105,0]} />
				<RightPaddle ref={rightPaddleRef} position={[151, 0, 0]} />
				<LeftPaddle ref={leftPaddleRef} position={[-151, 0, 0]} keyMap={keyMap}/>
				<Ball
					rightPaddleRef={rightPaddleRef}
					leftPaddleRef={leftPaddleRef}
					p1Score={p1Score} setP1Score={setP1Score}
					p2Score={p2Score} setP2Score={setP2Score}
					setWinner={setWinner}
					gameOver={gameOver} setGameOver={setGameOver}
					scoreVisible={scoreVisible}
					isBallVisible={isBallVisible} setBallVisibility={setBallVisibility}
					ref={ballRef}
				/>
				<CubeLine />
				<OrbitControls enablePan={false} />
				<Scoreboard
					player1={p1Score}
					player2={p2Score}
					rightPaddleRef={rightPaddleRef}
					leftPaddleRef={leftPaddleRef}
					scoreVisible={scoreVisible} 
				/>
			</Canvas>
			<EndModal isOpen={showModal} onClose={closeModal} winner={winner} setReset={setReset} />
		</div>
	);
}
