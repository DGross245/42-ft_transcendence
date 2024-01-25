"use client"

import { MutableRefObject, useContext, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei'; 
import inputHandler from '@/components/inputHandler';
import Camera from '../sharedComponents/Camera';
import Border from './components/Border';
import { RightPaddle, LeftPaddle, TopPaddle, BottomPaddle } from './components/Paddle';
import { Ball } from './components/Ball';
import { CubeLineY, CubeLineX }from './components/CubeLine';
import Scoreboard from './components/Scoreboard';
import EndModal from './components/EndModal';
import Countdown from '../sharedComponents/Countdown';
import { Mesh } from 'three'
import { PongContext } from '../PongProvider';
import { useGameState } from './hooks/useGameState';
import { useWebSocket } from './hooks/useWebSocket';

/**
 * The OneForAllScene component is a Three.js scene representing a 4 player Pong game that includes various elements such as paddles,
 * ball, borders, camera, countdown, scoreboard, and a modal for displaying the winner.
 * @returns The entire Three.js scene, including the modal.
 */
export default function OneForAllScene() {
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
	const keyMap = inputHandler();
	const { closeModal, showModal,
		p1Score, setP1Score, p2Score, setP2Score,
		p3Score, setP3Score, p4Score, setP4Score,
		winner, setWinner, setReset,
		isScoreVisible, setScoreVisibility,
		isBallVisible, setBallVisibility,
		isGameOver, setGameOver, disconnected, setDisconnected } = useGameState();
	const { topPaddleRef,bottomPaddleRef, rightPaddleRef, leftPaddleRef, ballRef } = useContext(PongContext);

	useWebSocket(isGameOver, setGameOver, disconnected, setDisconnected);

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
		<div >
			<Canvas style={{ width: dimensions.width, height: dimensions.height }}>
				<Countdown scoreVisible={isScoreVisible} setScoreVisibility={setScoreVisibility} rotation={[0, 0, 0]} />
				<Camera position={[0, 350, 400]}/> 
				<Border />
				<TopPaddle ref={topPaddleRef} position={[0, 0, -151]} keyMap={keyMap} />
				<BottomPaddle ref={bottomPaddleRef} position={[0, 0, 151]} keyMap={keyMap} />
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
					gameOver={isGameOver} setGameOver={setGameOver}
					scoreVisible={isScoreVisible}
					isBallVisible={isBallVisible} setBallVisibility={setBallVisibility}
					ref={ballRef}
				/>
				<CubeLineY />
				<CubeLineX />
				<OrbitControls enablePan={false} enableRotate={true} />
				<Scoreboard 
					player1={p1Score} player2={p2Score} player3={p3Score} player4={p4Score}
					rightPaddleRef={rightPaddleRef} leftPaddleRef={leftPaddleRef}
					topPaddleRef={topPaddleRef} bottomPaddleRef={bottomPaddleRef}
					scoreVisible={isScoreVisible} />
				<Stats />
			</Canvas>
			<EndModal
				isOpen={showModal}
				onClose={closeModal}
				winner={winner}
				setReset={setReset}
				disconnect={disconnected}
			/>
		</div>
	);
}
