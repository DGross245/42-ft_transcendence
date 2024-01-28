import { useContext, useEffect, Dispatch, SetStateAction } from "react";
import { GameStateContext, initialBoard, winningCoords } from "../context/GameState";

export const useGameState = () => {
	return useContext(GameStateContext);
}

export const useGameEvent = (
	maxClients: number,
	setRequestRematch: Dispatch<SetStateAction<boolean>>,
	setSendRequest: Dispatch<SetStateAction<boolean>>,
	rematchIndex: number
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
	} = useGameState();

	// Handling the reset of the scene, resetting important states.
	useEffect(() => {
		if (gameState.reset) {
			// closeModal();
			setBoard(initialBoard());
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