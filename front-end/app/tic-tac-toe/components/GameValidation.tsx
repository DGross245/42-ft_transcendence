import { Dispatch, SetStateAction } from "react";

export const gameValidation = ( 
	board: string[][][],
	SceneCoords: number [][][][],
	coords: number [][],
	setCoords: Dispatch<SetStateAction<number[][]>>) => {
		const directions = [

			[[ 1, 0, 0], [ 2, 0, 0]],
			[[ 0, 1, 0], [ 0, 2, 0]],
			[[ 0, 0, 1], [ 0, 0, 2]],
			[[ 1, 1, 0], [ 2, 2, 0]],
			[[-1, 1, 0], [-2, 2, 0]],
			[[ 1,-1, 0], [ 2,-2, 0]],
			[[ 1, 0, 1], [ 2, 0, 2]],
			[[-1, 0, 1], [-2, 0, 2]],
			[[ 0, 1, 0], [ 0, 2, 0]],
			[[ 0, 1, 1], [ 0, 2, 2]],
			[[ 0,-1, 1], [ 0,-2, 2]],
			[[ 0, 0,-1], [ 0, 0,-2]],
			[[ 0, 1,-1], [ 0, 2,-2]],
			[[ 1, 1,-1], [ 2, 2,-2]],
			[[ 1,-1,-1], [ 2,-2,-2]],
			[[-1,-1,-1], [-2,-2,-2]],
			[[-1, 1,-1], [-2, 2,-2]],

		];

		for (const direction of directions) {
			const [start, end] = direction;
			for (let i = 0; i < board.length; i++) {
				for (let j = 0; j < board[i].length; j++) {
					for (let k = 0; k < board[i][j].length; k++) {
						const symbol = board[i][j][k];
						if (symbol !== '') {
							let p = 0;
							coords[p++] = SceneCoords[i][j][k];
							let count = 1;
							let x = i + start[0];
							let y = j + start[1];
							let z = k + start[2];
							while (x >= 0 && x < board.length && y >= 0 && y < board[x].length && z >= 0 && z < board[x][y].length) {
								if (board[x][y][z] === symbol) {
									count++;
									coords[p++] = SceneCoords[x][y][z];
									if (count === 3) {
										setCoords(coords);
										return symbol;
									}
								} else {
									break;
								}
								x += start[0];
								y += start[1];
								z += start[2];
							}
						}
					}
				}
			}
		}

	return null;
}