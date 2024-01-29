import { useEffect, useState } from "react";

export const useField = () => {
	const [hovered, hover] = useState(false);
	const [symbol, setSymbol] = useState<string>();

	const handleHover = ( state: boolean) => {
		if (playerState.players[playerState.client].symbol == currentTurn)
			hover(state);
	};

	const handleClick = () => {
		if (!clicked && !symbol && playerState.players[playerState.client].symbol === currentTurn) {
			click(true);
			setSymbol(currentTurn);

			// Updates the board state by assigning the symbol to the corresponding position.
			const updatedBoard = [...board];
			updatedBoard[i][j][k] = currentTurn;
			updateBoard(updatedBoard);

			// Updates the scene coordinates for this field.
			const updateSceneCoords = [...sceneCoords];
			updateSceneCoords[i][j][k] = props.position;
			setSceneCoords(updateSceneCoords);
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
	}, [board]);

	return {
		hovered, hover, handleClick, handleHover
	}
}