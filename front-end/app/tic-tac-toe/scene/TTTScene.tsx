"use client"

import { Canvas } from "@react-three/fiber";
import { useGameEvent } from "../hook/useGameEvent";
import { useSocketEvent } from "../hook/useSocketEvent";
import { useWindow } from "../hook/useWindow";
import { OrbitControls } from "@react-three/drei";
import Countdown from "../TTT/Countdown";
import Camera from "../TTT/Camera";

// TODO: Add a lose function, that displays losing modal + plays random lose sound
// TODO: Add maybe a minimap where you can see the board better

/**
 * The TTTScene component is a Three.js scene that represents the main scene of the Tic Tac Toe game.
 * It handles game state, user interactions, and 3D rendering of the game board.
 * Uses various hooks for state management and effects for handling game logic,
 * resizing, modal display, and game completion.
 * @returns The entire Three.js scene, including the modal.
 */
const TTTSceneTEST = () => {
	const { dimensions } = useWindow();
	const maxClients = 2;
	
	// Event hooks
	useSocketEvent();
	useGameEvent(maxClients);

	return (
		<div style={{ width: '100%', height: '100%' }}>
			<Canvas style={{ width: dimensions.width, height: dimensions.height }}>
				<Countdown />
				<Camera />
				
				{gridLineGenrator()}
				{!countdownVisible && fieldGenerator(clicked, click, currentTurn, board, setCurrentBoardState, sceneCoords, setSceneCoords, isGameOver)}
				<Floor position={[ 3, -0.2, 3]} args={[0.25, 23.2, 23.2]} /> 
				<Floor position={[ 3,  7.8, 3]} args={[0.25, 23.2, 23.2]} />
				<Floor position={[ 3, 15.8, 3]} args={[0.25, 23.2, 23.2]} />
				<Floor position={[ 3, 23.8, 3]} args={[0.25, 23.2, 23.2]} />
				<TurnDisplay />
				<FinishLine coords={coords} visible={showFinishLine} colour={colour} />
				<OrbitControls
					enableZoom={false}
					target={[4, 10, 2]}
					enableRotate={true}
					enablePan={false}
				/>
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

export default TTTSceneTEST;