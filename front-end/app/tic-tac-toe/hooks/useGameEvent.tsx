import { useEffect } from "react";

import { useGameState } from "./useGameState";
import { initialBoard, winningCoords } from "../context/TTTGameState";
import { useSocket } from "./useSocket";

export const useGameEvent = (
	maxClients: number,
) => {
	const {
		gameState,
		setBoard,
		setTurn,
		setLineCoords,
		updateGameState,
		setWinner,
		setCountdownVisible,
		countdownVisible,
		setLineVisible
	} = useGameState();
	const { rematchIndex, setRematchIndex, setRequestRematch, setSendRequest } = useSocket();

	// Handling the reset of the scene, resetting important states.
	useEffect(() => {
		if (gameState.reset) {
			setBoard(initialBoard());
			setTurn('');
			setLineCoords([...winningCoords]);
			setWinner('');
			setCountdownVisible(true);
			setLineVisible(false)
			updateGameState({ ...gameState, reset: false, gameOver: false })
		}
	}, [gameState]);

	useEffect(() => {
		if (rematchIndex === maxClients) {
			updateGameState({ ...gameState, reset: true});
			setRequestRematch(false);
			setSendRequest(false);
			setRematchIndex(0);
		}
	}, [rematchIndex]);

	useEffect(() => {
		if (!countdownVisible)
			setTurn('X');
	}, [countdownVisible]);
}