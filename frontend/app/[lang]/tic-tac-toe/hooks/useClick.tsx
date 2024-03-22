import { useEffect, useState } from "react";

import { useSound } from "@/components/hooks/Sound";
import { useGameState } from "./useGameState";
import { useSocket } from "./useSocket";
import { gameValidation } from "@/components/TTT/GameValidation";

export const useClick = () => {
	const playSound = useSound();
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
		isGameMode,
		setLineVisible,
		setBotMoved,
		botState
	} = useGameState();

	useEffect(() => {
		if (clicked) {
			playSound("tictactoe");
			click(false);
			const newBoard = JSON.stringify(board);
			wsclient?.emitMessageToGame(newBoard,`Board-${gameState.gameId}`, gameState.gameId);
			const winner = gameValidation(board, sceneCoords, lineCoords, setLineCoords, setLineVisible);
			if (winner) {
				setWinner(winner);
				updateGameState({ gameOver: true })
				return;
			}
			if (isGameMode) {
				if (botState.isActive && currentTurn === botState.symbol) {
					setBotMoved(false);
				}
				setTurn(currentTurn === 'X' ? 'O' : currentTurn === 'O' ? '🔳' : 'X');
			} else {
				setTurn(currentTurn === 'X' ? 'O' : 'X');
				setBotMoved(false);
			}
		}
	},[clicked, board, botState,currentTurn, gameState.gameId, isGameMode, lineCoords, sceneCoords, wsclient, setBotMoved, setLineCoords, setLineVisible, setTurn, setWinner, playSound, updateGameState]);

	// Thinking about sending only changed array instead of all of it
	useEffect(() => {
		const setNewBoard = (msg: string) => {
			let newBoard = JSON.parse(msg);
			setBoard(newBoard);
		};

		if (wsclient && gameState.gameId !== "-1") {
			wsclient?.addMessageListener(`Board-${gameState.gameId}`, gameState.gameId, setNewBoard)

			return () => {
				wsclient?.removeMessageListener(`Board-${gameState.gameId}`, gameState.gameId);
			} 
		}
	}, [wsclient, gameState.gameId, setBoard]);

	return {
		clicked, click
	};
};