"use client"

import { Canvas } from "@react-three/fiber"
import React, { useEffect, useState } from 'react';
import { OrbitControls } from '@react-three/drei'; 
import Floor from "../sharedComponents/Floor";
import { gameValidation }  from "../sharedComponents/GameValidation"
import FinishLine from "../sharedComponents/FinishLine";
import { fieldGenerator, gridLineGenrator } from "./components/Grid";
import EndModal from "./components/EndModal";
import Camera from "../sharedComponents/Camera";
import Countdown from "../sharedComponents/Countdown";
import inputHandler from "@/components/inputHandler";

// Used to track user moves for validation
// '' = empty position, 'X' or 'O' updated on user click
// Used to validate winning combinations
const initialBoard = () =>  {
	return (
		[
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
		]
	)
}

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
	const [board, setCurrentBoardState] = useState(initialBoard());
	const [sceneCords, setSceneCords] = useState([...initialSceneCords]);
	const [showFinishLine, setShowFinishLine] = useState(false);
	const [coords, setCoords] = useState([...winningCoords]);
	const [colour, setColour] = useState(0xffffff);
	const [showModal, setShowModal] = useState(false);
	const [gameOver, setGameOver] = useState(false);
	const [winner, setWinner] = useState('');
	const [countdownVisible, setCountdownVisible] = useState(true);
	const [reset, setReset] = useState(false);
	const keyMap = inputHandler();

	const closeModal = () => {
		setShowModal(false);
	}

	const openModal = () => {
		setShowModal(true);
	}

	useEffect(() => {
		if (reset) {
			closeModal();
			setCurrentBoardState(initialBoard());
			setTurn('X');
			setShowFinishLine(false);
			setCoords([...winningCoords]);
			setColour(0xffffff);
			setGameOver(false);
			setWinner('');
			setCountdownVisible(true);
			setReset(false);
		}
	}, [reset]);

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
				<Camera dimensions={dimensions} keyMap={keyMap} target={[ 0, 0, 0]} reset={reset} />
				{gridLineGenrator()}
				{!countdownVisible && fieldGenerator(clicked, click, currentTurn, board, setCurrentBoardState, sceneCords, setSceneCords, gameOver)}
				<Floor position={[ 0, -0.2, 0]} args={[0.25, 17.5, 17.5]} /> 
				<Floor position={[ 0,  7.8, 0]} args={[0.25, 17.5, 17.5]} />
				<Floor position={[ 0, 15.8, 0]} args={[0.25, 17.5, 17.5]} />
				<FinishLine coords={coords} visible={showFinishLine} colour={colour} />
				<OrbitControls enableZoom={true} enableRotate={!countdownVisible} enablePan={false} />
			</Canvas>
			<EndModal setReset={setReset} isOpen={showModal} onClose={closeModal} winner={winner} />
		</div> 
	);
}

export default TTTScene;