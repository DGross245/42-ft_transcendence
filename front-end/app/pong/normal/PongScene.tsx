"use client"

import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei'; 
import Camera from '../sharedComponents/Camera';
import Border from './components/Border';
import { RightPaddle, LeftPaddle } from './components/Paddle';
import Ball from './components/Ball';
import CubeLine from './components/CubeLine';
import GroundReflection from './components/GroundReflection';
import Scoreboard from './components/Scoreboard';
import EndModal from './components/EndModal';
import Countdown from '../sharedComponents/Countdown';
import inputHandler from '@/components/inputHandler';

// TODO: change player order 4 = 1, 1 = 2, 2 = 3, 3 = 4
/**
 * The PongScene component is a Three.js scene representing a Pong game that includes various elements such as paddles,
 * ball, borders, camera, countdown, scoreboard, and a modal for displaying the winner.
 * @returns The entire Three.js scene, including the modal.
 */
export default function PongScene() {
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
	const keyMap = inputHandler();
	const rightPaddleRef = useRef<THREE.Mesh>(null);
	const leftPaddleRef = useRef<THREE.Mesh>(null);
	const [p1Score, setP1Score] = useState(0);
	const [p2Score, setP2Score] = useState(0);
	const [showModal, setShowModal] = useState(false);
	const [winner, setWinner] = useState('');
	const [gameOver, setGameOver] = useState(false);
	const [scoreVisible, setScoreVisible] = useState(false);
	const [reset, setReset] = useState(false);
	const [isBallVisible, setBallVisibility] = useState(true);

	const closeModal = () => {
		setShowModal(false);
	}

	const openModal = () => {
		setShowModal(true);
	}

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
			setScoreVisible(false);
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
				<Countdown scoreVisible={scoreVisible} setScoreVisible={setScoreVisible} rotation={[0, 0, 0]} />
				<Camera position={[0, -100, 300]} keyMap={keyMap} />
				<ambientLight />
				<Border position={[0,105,0]} />
				<Border position={[0,-105,0]} />
				<RightPaddle ref={rightPaddleRef} position={[151, 0, 0]} keyMap={keyMap} />
				<LeftPaddle ref={leftPaddleRef} position={[-151, 0, 0]} keyMap={keyMap} />
				<Ball
					rightPaddleRef={rightPaddleRef}
					leftPaddleRef={leftPaddleRef}
					p1Score={p1Score} setP1Score={setP1Score}
					p2Score={p2Score} setP2Score={setP2Score}
					setWinner={setWinner}
					gameOver={gameOver} setGameOver={setGameOver}
					scoreVisible={scoreVisible}
					isBallVisible={isBallVisible} setBallVisibility={setBallVisibility}
				/>
				<CubeLine />
				<GroundReflection />
				<OrbitControls enablePan={false} />
				<Scoreboard player1={p1Score} player2={p2Score} scoreVisible={scoreVisible} />
			</Canvas>
			<EndModal isOpen={showModal} onClose={closeModal} winner={winner} setReset={setReset} />
		</div>
	);
}
