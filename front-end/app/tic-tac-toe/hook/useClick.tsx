import { useSound } from "@/components/Sound";
import { useContext, useEffect, useState } from "react";
import { gameValidation } from "../sharedComponents/GameValidation";
import { TTTContext } from "../TTTProvider";

export const useClick = (
	setColour, setShowFinishLine, setWinner, setGameOver, board,
	sceneCoords, coords, setCoords, setTurn, currentTurn, setCurrentBoardState) => {
	const soundEngine = useSound();
	const [clicked, click] = useState(false);

	const { playerState, gameState} = useContext(TTTContext)

	useEffect(() => {
		if (clicked) {
			soundEngine?.playSound("tictactoe");
			click(false);
			const newBoard = JSON.stringify(board);
			gameState.wsclient?.emitMessageToGame(newBoard,`Board-${gameState.gameId}`, gameState.gameId);
			const winner = gameValidation(board, sceneCoords, coords, setCoords);
			if (winner) {
				setColour(winner === 'X' ? 0xff0000 : 0x1aabff);
				setShowFinishLine(true);
				setWinner(winner);
				setGameOver(true);
				return;
			}
			setTurn(currentTurn === 'X' ? 'O' : 'X');
		}
	},[clicked]);

	useEffect(() => {
		console.log("Updated");
	},[board])
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