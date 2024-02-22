import { useCallback, useEffect, useState } from "react";

import { FieldProps } from "@/components/TTT/Field";
import { useSocket } from "./useSocket";
import { useGameState } from "./useGameState";
import { useClick } from "./useClick";

export const useField = (props: FieldProps) => {
	const [hovered, hover] = useState(false);
	const [symbol, setSymbol] = useState<string>();
	const { position, i, j, k } = props;
	const { playerState } = useSocket();
	const { click } = useClick();
	const { board, setSceneCoords, sceneCoords, setBoard, currentTurn, gameState, countdownVisible } = useGameState();

	const handleHover = useCallback(( state: boolean) => {
		if (playerState.client === -1 || gameState.pause || countdownVisible) return ;
		if (playerState.players[playerState.client].symbol == currentTurn)
			hover(state);
	},[countdownVisible, currentTurn, gameState.pause, playerState.client, playerState.players]);

	const handleClick = useCallback(() => {
		if (playerState.client === -1 || gameState.pause || countdownVisible) return ;
		if (!symbol && playerState.players[playerState.client].symbol === currentTurn && !gameState.gameOver) {
			click(true);
			setSymbol(currentTurn);
			hover(false);

			// Updates the board state by assigning the symbol to the corresponding position.
			const updatedBoard = [...board];
			updatedBoard[i][j][k] = currentTurn;
			setBoard(updatedBoard);

			// Updates the scene coordinates for this field.
			const updateSceneCoords = [...sceneCoords];
			updateSceneCoords[i][j][k] = props.position;
			setSceneCoords(updateSceneCoords)
		}
	},[board, click, countdownVisible, currentTurn, gameState.gameOver, gameState.pause, i, j,k, playerState.client, playerState.players, props.position, sceneCoords, setBoard, setSceneCoords, symbol])

	useEffect(() => {
		if (board[i][j][k] !== '' && !symbol) {
			setSymbol(board[i][j][k]);

			const updateSceneCoords = [...sceneCoords];
			updateSceneCoords[i][j][k] = position;
			setSceneCoords(updateSceneCoords);
			click(true);
		}
	}, [board, click, i, j, k, position, sceneCoords, setSceneCoords, symbol]);

	useEffect(() => {
		if (board[i][j][k] === '' && symbol) {
			setSymbol(undefined);
		}
	}, [board, i, j, k, symbol]);

	return {
		hovered, hover, handleClick, handleHover, symbol
	}
}