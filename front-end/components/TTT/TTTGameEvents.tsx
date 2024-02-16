import { useEffect } from "react";

import { initialBoard, winningCoords } from "@/app/tic-tac-toe/context/TTTGameState";
import { useGameState } from "@/app/tic-tac-toe/hooks/useGameState";
import { useSocket } from "@/app/tic-tac-toe/hooks/useSocket";
import { useKey } from "../hooks/useKey";

export const TTTGameEvents = () => {
	// Provider hooks 
	const {
		gameState,
		setBoard,
		setTurn,
		setLineCoords,
		updateGameState,
		setWinner,
		setCountdownVisible,
		countdownVisible,
		setLineVisible,
		isGameMode,
	} = useGameState();
	const {
		rematchIndex,
		setRematchIndex,
		setRequestRematch,
		setSendRequest
	} = useSocket();

	// Normal hooks
	const escape = useKey(['Escape']);

	// Handling the reset of the scene, resetting important states.
	useEffect(() => {
		if (gameState.reset) {
			setBoard(initialBoard());
			setTurn('');
			setLineCoords([...winningCoords]);
			setWinner('');
			setCountdownVisible(true);
			setLineVisible(false)
			updateGameState({ ...gameState, reset: false, gameOver: false})
		}
	}, [gameState]);

	// Handle pause when esc is pressed
	useEffect(() => {
		if (escape.isKeyDown)
			updateGameState({ ...gameState, pause: true});
	},[escape])

	// Execute reset when all players want a rematch
	useEffect(() => {
		// Check if all players have requested a rematch
		if (rematchIndex === (isGameMode ? 3 : 2)) {
			// Update game state to trigger a reset
			updateGameState({ ...gameState, reset: true});

			// Reset rematch-related flags
			setRequestRematch(false);
			setSendRequest(false);
			setRematchIndex(0);
		}
	}, [rematchIndex]);

	// Initializes the turn after countdown
	useEffect(() => {
		if (!countdownVisible)
			setTurn('X');
	}, [countdownVisible]);

	return (null);
}