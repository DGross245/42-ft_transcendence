"use client"

import { Canvas } from "@react-three/fiber"
import React, { useContext, useEffect, useState } from 'react';
import { OrbitControls } from '@react-three/drei'; 
import Floor from "../sharedComponents/Floor";
import { gameValidation }  from "../sharedComponents/GameValidation"
import FinishLine from "../sharedComponents/FinishLine";
import { fieldGenerator, gridLineGenrator } from "./components/Grid";
import EndModal from "./components/EndModal";
import Camera from "../sharedComponents/Camera";
import Countdown from "../sharedComponents/Countdown";
import inputHandler from "@/components/inputHandler";
import TurnDisplay from "./components/TurnDisplay";
import { useSound } from "@/components/Sound";
import { useGameState } from "./hook/useGameState";
import { useClick } from "./hook/useClick";
import { useWebSocket } from "./hook/useWebSocket";
import { TTTContext } from "../TTTProvider";


// TODO: Add a lose function, that displays losing modal + plays random lose sound
// TODO: Add maybe a minimap where you can see the board better

/**
 * The TTTScene component is a Three.js scene that represents the main scene of the Tic Tac Toe game.
 * It handles game state, user interactions, and 3D rendering of the game board.
 * Uses various hooks for state management and effects for handling game logic,
 * resizing, modal display, and game completion.
 * @returns The entire Three.js scene, including the modal.
 */
const TTTScene = () => {
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
	const { currentTurn, setTurn,
		board, setCurrentBoardState,
		sceneCoords, setSceneCoords,
		showFinishLine, setShowFinishLine,
		coords, setCoords,
		colour, setColour,
		showModal, reset, keyMap,
		isGameOver, setGameOver,
		winner, setWinner,
		countdownVisible, setCountdownVisible,
		closeModal, setSendRequest,
		setDisable, setRequestRematch,
		sendRequest, requestRematch,
		disable
	} = useGameState();
	const { click, clicked } = useClick(setColour, setShowFinishLine, setWinner, setGameOver, board, sceneCoords, coords, setCoords, setTurn, currentTurn, setCurrentBoardState);

	useWebSocket( isGameOver, setGameOver, setWinner, setDisable, setRequestRematch, setSendRequest, sendRequest );

	// Updates window dimensions on window resizing and
	// changes the turn after a clicked field and checks if a winning condition
	// is achived.
	useEffect(() => {
		const handleResize = () => {
			setDimensions({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		}

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
				<Camera keyMap={keyMap} target={[4, 10, 2]} reset={reset} />
				{gridLineGenrator()}
				{!countdownVisible && fieldGenerator(clicked, click, currentTurn, board, setCurrentBoardState, sceneCoords, setSceneCoords, isGameOver)}
				<Floor position={[ 3, -0.2, 3]} args={[0.25, 23.2, 23.2]} /> 
				<Floor position={[ 3,  7.8, 3]} args={[0.25, 23.2, 23.2]} />
				<Floor position={[ 3, 15.8, 3]} args={[0.25, 23.2, 23.2]} />
				<TurnDisplay turn={currentTurn} />
				<FinishLine coords={coords} visible={showFinishLine} colour={colour} />
				<OrbitControls enableZoom={false} target={[4, 10, 2]} enableRotate={true} enablePan={false} />
			</Canvas>
			<EndModal
				isOpen={showModal}
				onClose={closeModal}
				winner={winner}
				setSendRequest={setSendRequest}
				sendRequest={sendRequest}
				requestRematch={requestRematch}
				disable={disable}
			/>
		</div> 
	);
}

export default TTTScene;