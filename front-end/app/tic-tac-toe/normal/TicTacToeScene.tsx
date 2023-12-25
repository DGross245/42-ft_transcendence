"use client"

import { Canvas } from "@react-three/fiber"
import React, { useEffect, useState } from 'react';
import { OrbitControls } from '@react-three/drei'; 
import Floor from "./components/Floor";
import { gameValidation }  from "./components/GameValidation"
import FinishLine from "./components/FinishLine";
import { fieldGenerator, gridLineGenrator } from "./components/Grid";
import EndModal from "./components/EndModal";
import Camera from "./components/Camera";
import Countdown from "@/app/tic-tac-toe/normal/components/Countdown";

// TODO: Maybe add a botton like 1 that sets the camera to the original position (Not only for TTT)

// Used to track user moves for validation
// '' = empty position, 'X' or 'O' updated on user click
// Used to validate winning combinations
const initialBoardState = [
	[
		['', '', ''],
		['', '', ''],
		['', '', ''],
	],
	[
		['', '', ''],
		['', '', ''],
		['', '', ''],
	],
	[
		['', '', ''],
		['', '', ''],
		['', '', ''],
	],
];

// Initial coordinates for each field in the scene
// Each [0, 0, 0] represents the coordinates of a field
// Set on field creation
const initialSceneCords = [
	[
		[[0, 0, 0], [0, 0, 0], [0, 0, 0]],
		[[0, 0, 0], [0, 0, 0], [0, 0, 0]],
		[[0, 0, 0], [0, 0, 0], [0, 0, 0]],
	],
	[
		[[0, 0, 0], [0, 0, 0], [0, 0, 0]],
		[[0, 0, 0], [0, 0, 0], [0, 0, 0]],
		[[0, 0, 0], [0, 0, 0], [0, 0, 0]],
	],
	[
		[[0, 0, 0], [0, 0, 0], [0, 0, 0]],
		[[0, 0, 0], [0, 0, 0], [0, 0, 0]],
		[[0, 0, 0], [0, 0, 0], [0, 0, 0]],
	],
];

// Represents the 3 coordinates forming a winning line
// Extracted from initialSceneCords after finding a winner
const winningCoords = [
	[-1, -1, -1],[-1, -1, -1],[-1, -1, -1]
];

const TTTScene = () => {
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
	const [clicked, click] = useState(false);
	const [currentTurn, setTurn] = useState('X');
	const [board, setCurrentBoardState] = useState(initialBoardState);
	const [sceneCords, setSceneCords] = useState(initialSceneCords);
	const [showFinishLine, setShowFinishLine] = useState(false);
	const [coords, setCoords] = useState(winningCoords);
	const [colour, setColour] = useState(0xffffff);
	const [showModal, setShowModal] = useState(false);
	const [gameOver, setGameOver] = useState(false);
	const [winner, setWinner] = useState('');
	const [countdownVisible, setCountdownVisible] = useState(true);

	const closeModal = () => {
		setShowModal(false);
	}

	const openModal = () => {
		setShowModal(true);
	}

	useEffect(() => {
		if (gameOver) {
			const delay = 2000;
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
		}

		const checkClick = () => {
			if (clicked) {
				setTurn(currentTurn === 'X' ? 'O' : 'X');
				click(false);
				const winner = gameValidation(board, sceneCords, coords, setCoords);
				if (winner) {
					if (winner === 'X') {
						setShowFinishLine(true);
						setColour(0xff0000);
					}
					else if (winner === 'O') {
						setShowFinishLine(true);
						setColour(0x1aabff)
					}
					setWinner(winner);
					setGameOver(true);
				}
			}
		}

		checkClick();
		handleResize();

		window.addEventListener('resize', handleResize);

		return (() => {
			window.removeEventListener('resize', handleResize);
		});
	}, [clicked]);

	return (
		<div style={{ width: '100%', height: '100%' }}>
			<Canvas style={{ width: dimensions.width, height: dimensions.height }}>
				<Countdown countdownVisible={countdownVisible} setCountdownVisible={setCountdownVisible} />
				<Camera dimensions={dimensions} />
				{gridLineGenrator()}
				{!countdownVisible && fieldGenerator(clicked, click, currentTurn, board, setCurrentBoardState, sceneCords, setSceneCords, gameOver)}
				<Floor	position={[ 0,-0.2, 0]}/> 
				<Floor	position={[ 0, 7.8, 0]}/>
				<Floor	position={[ 0, 15.8, 0]}/>
				<FinishLine coords={coords} visible={showFinishLine} colour={colour} />
				<OrbitControls enableZoom={true} enableRotate={!countdownVisible}/>
			</Canvas>
			<EndModal isOpen={showModal} onClose={closeModal} winner={winner} />
		</div> 
	);
}

export default TTTScene;