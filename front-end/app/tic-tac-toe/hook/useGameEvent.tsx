import { useEffect, Dispatch, SetStateAction } from "react";
import { useGameState } from "./useGameState";
import { initialBoard, winningCoords } from "../context/GameState";
import { useSocket } from "./useSocket";

export const useGameEvent = (
	maxClients: number,
) => {
	const {
		gameState,
		updateBoard,
		setTurn,
		setLineCoords,
		updateGameState,
		setWinner,
		setCountdownVisible,
		countdownVisible,
	} = useGameState();

	const { rematchIndex, setRequestRematch, setSendRequest } = useSocket();

	// Handling the reset of the scene, resetting important states.
	useEffect(() => {
		if (gameState.reset) {
			// closeModal();
			updateBoard(initialBoard());
			setTurn('');
			setLineCoords([...winningCoords]);
			updateGameState({ ...gameState, reset: false, gameOver: false })
			setWinner('');
			setCountdownVisible(true);
		}
	}, [gameState.reset]);

	useEffect(() => {
		if (rematchIndex === maxClients) {
			setRequestRematch(false);
			setSendRequest(false);
			updateGameState({ ...gameState, reset: true});
		}
	}, [rematchIndex]);

	useEffect(() => {
		if (!countdownVisible)
			setTurn('X');
	}, [countdownVisible]);

	// Opens the EndModal after a delay if the 'gameOver' state is true.
	useEffect(() => {
		if (gameState.gameOver) {
			const delay = 2000;
			const modalTimeout = setTimeout(() => {
				// openModal();
			}, delay);

			return (() => {
				clearTimeout(modalTimeout)
			});
		}
	}, [gameState.gameOver]);
}