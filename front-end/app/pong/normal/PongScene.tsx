"use client"

import React, { MutableRefObject, useContext, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei'; 
import { Mesh } from 'three'

import { Border } from './components/Border';
import { RightPaddle, LeftPaddle } from './components/Paddle';
import { Ball } from './components/Ball';
import { Scoreboard } from './components/Scoreboard';
import EndModal from './components/EndModal';
import { CubeLine } from './components/CubeLine';

import Camera from '../sharedComponents/Camera';
import Countdown from '../sharedComponents/Countdown';
import inputHandler from '@/components/inputHandler';
import { PongContext } from '../PongProvider';
import useWSClient from '@/helpers/wsclient';
import { useGameState } from './hooks/useGameState';
import { useWebSocket } from './hooks/useWebSocket';

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
	const { rightPaddleRef, leftPaddleRef, ballRef, updateGameState, gameState } = useContext(PongContext);
	const { p1Score, p2Score, setP1Score, setP2Score, isScoreVisible, setScoreVisibility,
		setWinner, isGameOver, setGameOver, isBallVisible, setBallVisibility, showModal, closeModal,
		winner, sendRequest, setRequestRematch, setSendRequest, requestRematch} = useGameState();
	const keyMap = inputHandler();

	useWebSocket( isGameOver, sendRequest, setGameOver, setRequestRematch, setSendRequest );

	// Updates window dimensions on window resizing.
	useEffect(() => {
		const handleResize = () => {
			setDimensions({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		const handlePause = () => {
			// updateGameState({ ...gameState, pause: true })
			// gameState.wsclient?.emitMessageToGame("true", `Pause-${gameState.gameId}`, gameState.gameId);
		};
	
		handlePause();
		handleResize();

		window.addEventListener('resize', handleResize);
		window.addEventListener('blur', handlePause);

		return () => {
			window.removeEventListener('resize', handleResize);
			window.removeEventListener('blur', handlePause);
		};
	}, []);

	return (
		<div style={{ width: '100%', height: '100%' }}>
			<Canvas style={{ width: dimensions.width, height: dimensions.height }}>
				<Countdown scoreVisible={isScoreVisible} setScoreVisibility={setScoreVisibility} rotation={[0, 0, 0]} />
				<Camera position={[0, -100, 600]} />
				<Border position={[0,105,0]} />
				<Border position={[0,-105,0]} />
				<RightPaddle ref={rightPaddleRef} position={[151, 0, 0]} />
				<LeftPaddle ref={leftPaddleRef} position={[-151, 0, 0]} keyMap={keyMap} />
				<Ball
					rightPaddleRef={rightPaddleRef}
					leftPaddleRef={leftPaddleRef}
					p1Score={p1Score} setP1Score={setP1Score}
					p2Score={p2Score} setP2Score={setP2Score}
					setWinner={setWinner}
					gameOver={isGameOver} setGameOver={setGameOver}
					scoreVisible={isScoreVisible}
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
					scoreVisible={isScoreVisible} 
				/>
			</Canvas>
			<EndModal
				isOpen={showModal}
				onClose={closeModal}
				winner={winner}
				setSendRequest={setSendRequest}
				sendRequest={sendRequest}
				requestRematch={requestRematch}
			/>
		</div>
	);
}