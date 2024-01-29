"use client"

import { Canvas } from "@react-three/fiber";
import { useGameEvent } from "../hook/useGameEvent";
import { useSocketEvent } from "../hook/useSocketEvent";
import { useWindow } from "../hook/useWindow";
import { OrbitControls } from "@react-three/drei";
import Countdown from "../../../components/TTT/Countdown";
import Camera from "../../../components/TTT/Camera";
import { Grid } from "../../../components/TTT/Grid";
import Floor from "../../../components/TTT/Floor";
import { FieldLayers } from "../../../components/TTT/FieldLayers";
import { useClick } from "../hook/useClick";
import TurnDisplay from "../../../components/TTT/TurnDisplay";
import FinishLine from "../../../components/TTT/FinishLine";
import { useGameState } from "../hook/useGameState";

/**
 * The TTTScene component is a Three.js scene that represents the main scene of the Tic Tac Toe game.
 * It handles game state, user interactions, and 3D rendering of the game board.
 * Uses various hooks for state management and effects for handling game logic,
 * resizing, modal display, and game completion.
 * @returns The entire Three.js scene, including the modal.
 */
const TTTScene = () => {
	const { isGameMode } = useGameState();
	const { dimensions } = useWindow();
	const maxClients = isGameMode ? 4 : 2;
	const { click, clicked } = useClick();

	// Event hooks
	useSocketEvent();
	useGameEvent(maxClients);

	return (
		<div style={{ width: '100%', height: '100%' }}>
			<Canvas style={{ width: dimensions.width, height: dimensions.height }}>
				<Countdown />
				<Camera />
				<Grid />
				<FieldLayers clicked={clicked} click={click} />
				<Floor position={[ 3, -0.2, 3]} args={[0.25, 23.2, 23.2]} /> 
				<Floor position={[ 3,  7.8, 3]} args={[0.25, 23.2, 23.2]} />
				<Floor position={[ 3, 15.8, 3]} args={[0.25, 23.2, 23.2]} />
				<Floor position={[ 3, 23.8, 3]} args={[0.25, 23.2, 23.2]} />
				<TurnDisplay />
				<FinishLine />
				<OrbitControls
					enableZoom={false}
					target={[3, 11.8, 3]}
					enableRotate={true}
					enablePan={false}
				/>
			</Canvas>

		</div> 
	);
}

export default TTTScene;