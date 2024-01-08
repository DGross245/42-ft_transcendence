import { Dispatch, SetStateAction } from "react";
import Field from "./Field";
import GridLine from "../../sharedComponents/GridLine";

/**
 * Generates an array of Field components for the game board.
 * @param clicked - Indicates if the field was clicked (boolean).
 * @param click - Setter function for the clicked state.
 * @param currentTurn - Represents the current player's turn (X or O).
 * @param board - Three-dimensional array of strings representing the game board.
 * @param setCurrentBoardState - Setter for the board state.
 * @param sceneCoords - Stores 3D coordinates for each field on the board.
 * @param setSceneCoords - Setter for the sceneCoords state.
 * @param gameOver - Indicates if the game is over (boolean).
 * @returns Array of Field components.
 */
export const fieldGenerator = (
	clicked: boolean,
	click: React.Dispatch<React.SetStateAction<boolean>>,
	currentTurn: string,
	board: string[][][],
	setCurrentBoardState: React.Dispatch<React.SetStateAction<string[][][]>>,
	sceneCoords: number[][][][],
	setSceneCoords: Dispatch<SetStateAction<number[][][][]>>,
	gameOver: boolean) => {

	const fields = [];
	let l = 0;
	const arrayPosition = [
		{ i: 0, j: 0, k: 0 }, { i: 0, j: 1, k: 0 }, { i: 0, j: 2, k: 0 },
		{ i: 0, j: 0, k: 1 }, { i: 0, j: 1, k: 1 }, { i: 0, j: 2, k: 1 },
		{ i: 0, j: 0, k: 2 }, { i: 0, j: 1, k: 2 }, { i: 0, j: 2, k: 2 },

		{ i: 1, j: 0, k: 0 }, { i: 1, j: 1, k: 0 }, { i: 1, j: 2, k: 0 },
		{ i: 1, j: 0, k: 1 }, { i: 1, j: 1, k: 1 }, { i: 1, j: 2, k: 1 },
		{ i: 1, j: 0, k: 2 }, { i: 1, j: 1, k: 2 }, { i: 1, j: 2, k: 2 },

		{ i: 2, j: 0, k: 0 }, { i: 2, j: 1, k: 0 }, { i: 2, j: 2, k: 0 },
		{ i: 2, j: 0, k: 1 }, { i: 2, j: 1, k: 1 }, { i: 2, j: 2, k: 1 },
		{ i: 2, j: 0, k: 2 }, { i: 2, j: 1, k: 2 }, { i: 2, j: 2, k: 2 },
	];

	for (let level = 0; level < 3; level++) {
		for (let i = -1; i < 2; i++) {
			for (let j = -1; j < 2; j++) {
				let x = 6 * i;
				let y = 8 * level;
				let z = 6 * j;
				const { i: fieldI, j: fieldJ, k: fieldK } = arrayPosition[l];
				fields.push(
						<Field
							key={`${fieldI}-${fieldJ}-${fieldK}`}
							position={[x,y,z]}
							rotation={[0, 0, Math.PI / 2]}
							clicked={gameOver ? gameOver : clicked}
							click={click}
							turn={currentTurn}
							board={board}
							setCurrentBoardState={setCurrentBoardState}
							sceneCoords={sceneCoords}
							setSceneCoords={setSceneCoords}
							i={fieldI}
							j={fieldJ}
							k={fieldK}
							gameOver={gameOver}
						/>
				);
				l++;
			}
		}
	}
	return (fields);
}

/**
 * Generating mulitple grid lines in a 3D scene. Defines coordinates and rotations for grid lines at specific positions.
 * Utilizes the GridLine component to create lines based on the coordinates and rotations.
 * @returns The generated array of GridLine components for the grid.
 */
export const gridLineGenrator = () => {
	const coords = [
		{ position: [ 3, 0, 0], rotation: [Math.PI / 2, 0, 0] },
		{ position: [-3, 0, 0], rotation: [Math.PI / 2, 0, 0] },
		{ position: [ 0, 0, 3], rotation: [0, 0, Math.PI / 2] },
		{ position: [ 0, 0,-3], rotation: [0, 0, Math.PI / 2] },

		{ position: [ 3, 8, 0], rotation: [Math.PI / 2, 0, 0] },
		{ position: [-3, 8, 0], rotation: [Math.PI / 2, 0, 0] },
		{ position: [ 0, 8, 3], rotation: [0, 0, Math.PI / 2] },
		{ position: [ 0, 8,-3], rotation: [0, 0, Math.PI / 2] },

		{ position: [ 3, 16, 0], rotation: [Math.PI / 2, 0, 0] },
		{ position: [-3, 16, 0], rotation: [Math.PI / 2, 0, 0] },
		{ position: [ 0, 16, 3], rotation: [0, 0, Math.PI / 2] },
		{ position: [ 0, 16,-3], rotation: [0, 0, Math.PI / 2] },
	];

	const lines = coords.map((line, index) => (
		<GridLine
			key={index}
			position={line.position}
			rotation={line.rotation}
			args={[0.5, 17.5, 0.5]}
		/>
	));

	return (lines);
}