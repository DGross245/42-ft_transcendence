"use client"

import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei'; 
import inputHandler from '@/components/inputHandler';
import Camera from '../sharedComponents/Camera';
import Border from './components/Border';
import { RightPaddle, LeftPaddle, TopPaddle, BottomPaddle } from './components/Paddle';
import Ball from './components/Ball';
import { CubeLineY, CubeLineX }from './components/CubeLine';
import GroundReflection from './components/GroundReflection';
import Scoreboard from './components/Scoreboard';
import EndModal from './components/EndModal';
import Countdown from '../sharedComponents/Countdown';

export default function OneForAllScene() {
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
	const keyMap = inputHandler();
	const rightPaddleRef = useRef<THREE.Mesh>(null!);
	const leftPaddleRef = useRef<THREE.Mesh>(null!);
	const topPaddleRef = useRef<THREE.Mesh>(null!);
	const bottomPaddleRef = useRef<THREE.Mesh>(null!);
	const [p1Score, setP1Score] = useState(0);
	const [p2Score, setP2Score] = useState(0);
	const [p3Score, setP3Score] = useState(0);
	const [p4Score, setP4Score] = useState(0);
	const [showModal, setShowModal] = useState(false);
	const [winner, setWinner] = useState('');
	const [gameOver, setGameOver] = useState(false);
	const [scoreVisible, setScoreVisible] = useState(false);

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
				<Countdown setScoreVisible={setScoreVisible} rotation={[Math.PI / 2, 0, 0]} />
				<Camera position={[0, -350, 100]} keyMap={keyMap} /> 
				<ambientLight />
				<Border />
				<TopPaddle ref={topPaddleRef} position={[0, 151, 0]} keyMap={keyMap} />
				<BottomPaddle ref={bottomPaddleRef} position={[0, -151, 0]} keyMap={keyMap} />
				<RightPaddle ref={rightPaddleRef} position={[151, 0, 0]} keyMap={keyMap} />
				<LeftPaddle ref={leftPaddleRef} position={[-151, 0, 0]} keyMap={keyMap} />
				<Ball
					rightPaddleRef={rightPaddleRef}
					leftPaddleRef={leftPaddleRef}
					topPaddleRef={topPaddleRef}
					bottomPaddleRef={bottomPaddleRef}
					p1Score={p1Score} setP1Score={setP1Score}
					p2Score={p2Score} setP2Score={setP2Score}
					p3Score={p3Score} setP3Score={setP3Score}
					p4Score={p4Score} setP4Score={setP4Score}
					setWinner={setWinner}
					gameOver={gameOver} setGameOver={setGameOver}
					scoreVisible={scoreVisible}
					keyMap={keyMap}
				/>
				<CubeLineY />
				<CubeLineX />
				{/* <GroundReflection /> */}
				<OrbitControls enablePan={false} />
				<Scoreboard player1={p1Score} player2={p2Score} player3={p3Score} player4={p4Score} scoreVisible={scoreVisible} />
				<Stats />
			</Canvas>
			<EndModal isOpen={showModal} onClose={closeModal} winner={winner} />
		</div>
	);
}
