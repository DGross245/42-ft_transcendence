"use client"

import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei'; 
import InputHandler from './hooks/InputHandler';
import Camera from './components/Camera';
import Border from './components/Border';
import { RightPaddle, LeftPaddle, TopPaddle, BottomPaddle } from './components/Paddle';
import Ball from './components/Ball';
import { CubeLineY, CubeLineX }from './components/CubeLine';
import GroundReflection from './components/GroundReflection';
import Scoreboard from './components/Scoreboard';
import EndModal from './components/EndModal';

export default function OneForAllScene() {
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
	const keyMap = InputHandler()
	const rightPaddleRef = useRef<THREE.Mesh>(null!);
	const leftPaddleRef = useRef<THREE.Mesh>(null!);
	const TopPaddleRef = useRef<THREE.Mesh>(null!);
	const BottomPaddleRef = useRef<THREE.Mesh>(null!);
	const [p1Score, setP1Score] = useState(0);
	const [p2Score, setP2Score] = useState(0);
	const [showModal, setShowModal] = useState(false);
	const [winner, setWinner] = useState('');
	const [gameOver, setGameOver] = useState(false);

	const closeModal = () => {
		setShowModal(false);
	}

	const openModal = () => {
		setShowModal(true);
	}

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
				<Camera /> 
				<ambientLight />
				<Border position={[130,151,0]} />
				<Border position={[-130,151,0]}/>
				<Border position={[-130,-151,0]} />
				<Border position={[130,-151,0]}/>
				<TopPaddle ref={TopPaddleRef} position={[0, 151, 0]} keyMap={keyMap} />
				<BottomPaddle ref={BottomPaddleRef} position={[0, -151, 0]} keyMap={keyMap} />
				<RightPaddle ref={rightPaddleRef} position={[151, 0, 0]} keyMap={keyMap} />
				<LeftPaddle ref={leftPaddleRef} position={[-151, 0, 0]} keyMap={keyMap} />
				{/* <Ball
					rightPaddleRef={rightPaddleRef}
					leftPaddleRef={leftPaddleRef}
					p1Score={p1Score} setP1Score={setP1Score}
					p2Score={p2Score} setP2Score={setP2Score}
					setWinner={setWinner}
					gameOver={gameOver} setGameOver={setGameOver}
				/> */}
				<CubeLineY />
				<CubeLineX />
				<GroundReflection />
				<OrbitControls />
				<Scoreboard player1={p1Score} player2={p2Score} />
			</Canvas>
			<EndModal isOpen={showModal} onClose={closeModal} winner={winner} />
		</div>
	);
}
