import { useEffect, useState } from "react";

import { useSound } from "@/components/Sound";
import { useGameState } from "./useGameState";
import { useSocket } from "./useSocket";
import { gameValidation } from "../../../components/TTT/GameValidation";

export const useClick = () => {
	const soundEngine = useSound();
	const [clicked, click] = useState(false);
	const { wsclient } = useSocket();
	const {
		gameState,
		board,
		sceneCoords,
		setTurn,
		updateGameState,
		setBoard,
		setWinner,
		lineCoords,
		setLineCoords,
		currentTurn,
		isGameMode
	} = useGameState();

	useEffect(() => {
		if (clicked) {
			soundEngine?.playSound("tictactoe");
			click(false);
			const newBoard = JSON.stringify(board);
			wsclient?.emitMessageToGame(newBoard,`Board-${gameState.gameId}`, gameState.gameId);
			const winner = gameValidation(board, sceneCoords, lineCoords, setLineCoords);
			if (winner) {
				setWinner(winner);
				updateGameState({ ...gameState, gameOver: true })
				return;
			}
			if (isGameMode)
				setTurn(currentTurn === 'X' ? 'O' : currentTurn === 'O' ? '🔳' : 'X');
			else
				setTurn(currentTurn === 'X' ? 'O' : 'X');
		}
	},[clicked, board]);

	// Thinking about sending only changed array instead of all of it
	useEffect(() => {
		const setNewBoard = (msg: string) => {
			let newBoard = JSON.parse(msg);
			setBoard(newBoard);
		};

		if (wsclient) {
			wsclient?.addMessageListener(`Board-${gameState.gameId}`, gameState.gameId, setNewBoard)

			return () => {
				wsclient?.removeMessageListener(`Board-${gameState.gameId}`, gameState.gameId);
			} 
		}
	}, [wsclient, gameState.gameId]);


	return {
		clicked, click
	};
};