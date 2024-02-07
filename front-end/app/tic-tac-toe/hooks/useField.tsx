import { useEffect, useState } from "react";

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
	const { board, setSceneCoords, sceneCoords, setBoard, currentTurn, gameState } = useGameState();

	const handleHover = ( state: boolean) => {
		if (playerState.client === -1) return ;
		if (playerState.players[playerState.client].symbol == currentTurn)
			hover(state);
	};

	const handleClick = () => {
		if (playerState.client === -1) return ;
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
	}

	useEffect(() => {
		if (board[i][j][k] !== '' && !symbol) {
			setSymbol(board[i][j][k]);

			const updateSceneCoords = [...sceneCoords];
			updateSceneCoords[i][j][k] = position;
			setSceneCoords(updateSceneCoords);
			click(true);
		}
	}, [board[i][j][k]]);

	useEffect(() => {
		if (board[i][j][k] === '' && symbol) {
			setSymbol(undefined);
		}
	}, [board[i][j][k]]);

	return {
		hovered, hover, handleClick, handleHover, symbol
	}
}