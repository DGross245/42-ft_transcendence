import { useSound } from "@/components/Sound";
import { useContext, useEffect, useState } from "react";
import { gameValidation } from "../../sharedComponents/GameValidation";
import { TTTContext } from "../../TTTProvider";

export const useClick = (
	setColour, setShowFinishLine, setWinner, setGameOver, board,
	sceneCoords, coords, setCoords, setTurn, currentTurn, setCurrentBoardState) => {
	const soundEngine = useSound();
	const [clicked, click] = useState(false);

	const { gameState} = useContext(TTTContext)

	useEffect(() => {
		if (clicked) {
			soundEngine?.playSound("tictactoe");
			click(false);
			const newBoard = JSON.stringify(board);
			gameState.wsclient?.emitMessageToGame(newBoard,`Board-${gameState.gameId}`, gameState.gameId);
			const winner = gameValidation(board, sceneCoords, coords, setCoords);
			if (winner) {
				if (winner === 'X') {
					setShowFinishLine(true);
					setColour(0xff0000);
				}
				else if (winner === 'O') {
					setShowFinishLine(true);
					setColour(0x1aabff)
				}
				else if (winner === '🔳') {
					setShowFinishLine(true);
					setColour(0x008000)
				}
				setWinner(winner);
				setGameOver(true);
				return ;
			}
			if (currentTurn == 'X')
				setTurn('O');
			else if (currentTurn == 'O')
				setTurn('🔳');
			else
				setTurn('X');
		}
	},[clicked]);

	useEffect(() => {
		const setNewBoard = (msg: string) => {
			let newBoard = JSON.parse(msg);
			setCurrentBoardState(newBoard);
		};

		if (gameState.wsclient) {
			gameState.wsclient?.addMessageListener(`Board-${gameState.gameId}`, gameState.gameId, setNewBoard)

			return () => {
				gameState.wsclient?.removeMessageListener(`Board-${gameState.gameId}`, gameState.gameId);
			} 
		}
	}, [gameState.wsclient, gameState.gameId, setCurrentBoardState]);


	return {
		clicked, click
	};
};
