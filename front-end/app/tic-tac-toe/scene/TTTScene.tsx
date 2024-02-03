"use client"

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import { useGameEvent } from "../hooks/useGameEvent";
import { useSocketEvent } from "../hooks/useSocketEvent";
import { useWindow } from "../hooks/useWindow";
import { Grid } from "@/components/TTT/Grid";
import { FieldLayers } from "@/components/TTT/FieldLayers";
import { useClick } from "../hooks/useClick";
import { useGameState } from "../hooks/useGameState";
import { useBot } from "../hooks/useBot";
import Countdown from "@/components/TTT/Countdown";
import Camera from "@/components/TTT/Camera";
import Floor from "@/components/TTT/Floor";
import TurnDisplay from "@/components/TTT/TurnDisplay";
import FinishLine from "@/components/TTT/FinishLine";
import EndModal from "@/components/TTT/EndModal";

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
	const maxClients = isGameMode ? 3 : 2;

	const { click, clicked } = useClick();

	useBot();
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
			<EndModal />
		</div> 
	);
}

export default TTTScene;