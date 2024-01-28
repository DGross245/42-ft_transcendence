import { Dispatch, SetStateAction } from "react";

/**
 * The function `gameValidation` checks if there is a winning line or a draw in a 3D tic-tac-toe game.
 * @param board - A 3-dimensional array representing the game board.
 * Each element of the array represents a field on the board and can contain one of three (in qubic four) values:
 * 'X', 'O', (🔳) or an empty string ('').
 * @param SceneCoords - SceneCoords is a 4-dimensional array that represents the
 * coordinates of each symbol in the game board.
 * @param coords - State 2D array of numbers that represents the coordinates of the three winning symbols.
 * @param setCoords - State setter to update the state of coords.
 * @returns either the symbol ('X' or 'O' (or '🔳')) if there is a winning line formed, 'draw' if the game is a
 * draw, or null if there is no winner yet.
 */
export const gameValidation = ( 
	board: string[][][],
	SceneCoords: number [][][][],
	coords: [number, number, number][],
	setCoords: Dispatch<SetStateAction<[number, number, number][]>>) => {
		// Represents possible symbol positions to form a winning line from a given location.
		// Left column: second possible symbol locations. Right column: third possible symbol locations.
		const directions = [
			[[ 1, 0, 0], [ 2, 0, 0],[ 1, 0, 0]],
			[[ 0, 1, 0], [ 0, 2, 0],[ 0, 1, 0]],
			[[ 0, 0, 1], [ 0, 0, 2],[ 0, 0, 1]],
			[[ 1, 1, 0], [ 2, 2, 0],[ 1, 1, 0]],
			[[-1, 1, 0], [-2, 2, 0],[-1, 1, 0]],
			[[ 1,-1, 0], [ 2,-2, 0],[ 1,-1, 0]],
			[[ 1, 0, 1], [ 2, 0, 2],[ 1, 0, 1]],
			[[-1, 0, 1], [-2, 0, 2],[-1, 0, 1]],
			[[ 0, 1, 0], [ 0, 2, 0],[ 0, 1, 0]],
			[[ 0, 1, 1], [ 0, 2, 2],[ 0, 1, 1]],
			[[ 0,-1, 1], [ 0,-2, 2],[ 0,-1, 1]],
			[[ 0, 0,-1], [ 0, 0,-2],[ 0, 0,-1]],
			[[ 0, 1,-1], [ 0, 2,-2],[ 0, 1,-1]],
			[[ 1, 1,-1], [ 2, 2,-2],[ 1, 1,-1]],
			[[ 1,-1,-1], [ 2,-2,-2],[ 1,-1,-1]],
			[[-1,-1,-1], [-2,-2,-2],[-1,-1,-1]],
			[[-1, 1,-1], [-2, 2,-2],[-1, 1,-1]],
		];

		let isDraw = true;

		for (const direction of directions) {
			const [start] = direction;
			for (let i = 0; i < board.length; i++) {
				for (let j = 0; j < board[i].length; j++) {
					for (let k = 0; k < board[i][j].length; k++) {
						const symbol = board[i][j][k];
						if (symbol !== '') {
							let p = 0;
							coords[p++] = SceneCoords[i][j][k] as [number, number, number];
							let count = 1;
							let x = i + start[0];
							let y = j + start[1];
							let z = k + start[2];
							while (x >= 0 && x < board.length && y >= 0 && y < board[x].length && z >= 0 && z < board[x][y].length) {
								if (board[x][y][z] === symbol) {
									count++;
									coords[p++] = [...SceneCoords[x][y][z]] as [number, number, number];
									if (count === 4) {
										setCoords(coords);
										return (symbol);
									}
								} else {
									break;
								}
								x += start[0];
								y += start[1];
								z += start[2];
							}
						}
						else if (symbol === '')
							isDraw = false;
					}
				}
			}
		}

	if (isDraw)
		return ('draw');
	return (null);
}