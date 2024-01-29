"use client"

interface TicTacToeBot {
	board: string[][][];
	symbol: string;
}

// vectors moving along possible winning lines
// should be 13
const win_vectors = [
	// one dimensionals
	[ 1, 0, 0 ],
	[ 0, 1, 0 ],
	[ 0, 0, 1 ],

	// two dimensional diagonals
	[ 1, 1, 0 ],
	[-1, 1, 0 ],

	// x-z diagonals
	[ 1, 0, 1 ],
	[-1, 0, 1 ],

	// y-z diagonals
	[ 0, 1, 1 ],
	[ 0,-1, 1 ],

	// three dimensional diagonals
	[ 1, 1, 1 ],
	[-1, 1, 1 ],
	[ 1,-1, 1 ],
	[ 1, 1,-1 ],
];

// coordinate data structure
interface Coordinate {
	x: number;
	y: number;
	z: number;
}

export const TicTacToeBot = ( board: string[][][], symbol: string ) => {

	// origin coordinates for each vector
	// const vector_origins = [
	// 	// one dimensionals
	// 	[ 0, 0, 0 ],
	// 	[ 0, 0, 0 ],
	// 	[ 0, 0, 0 ],

	// 	// two dimensional diagonals
	// 	[ 0, 0, 0 ],
	// 	[board.length, 0, 0 ],

	// 	// x-z diagonals
	// 	[ 0, 0, 0 ],
	// 	[ board.length, 0, 0 ],

	// 	// y-z diagonals
	// 	[ 0, 0, 0 ],
	// 	[ 0, board[0].length,-1 ],

	// 	// three dimensional diagonals
	// 	[ 1, 1, 1 ],
	// 	[-1, 1, 1 ],
	// 	[ 1,-1, 1 ],
	// 	[ 1, 1,-1 ],
	// ]; // @note this can't work because there are multiple possible origin coords for most of these vectors

	const getLongestLine = (board: string[][][], symbol: string) => {
		let longest_count: number = 0;
		let longest_coords: Coordinate = { x: 0, y: 0, z: 0 };
		let longest_vector: number[] = [];
		for (const vector of win_vectors) {
			for (let i = 0; i < board.length; i++) {
				for (let j = 0; j < board[i].length; j++) {
					for (let k = 0; k < board[i][j].length; k++) {
						if (i != 0 && j != 0 && k != 0)
							continue;
						let x = i;
						let y = j;
						let z = k;
						let temp = 0;
						let total = 0;
						while (x >= 0 && x < board.length
							&& y >= 0 && y < board[x].length
							&& z >= 0 && z < board[x][y].length) {
							if (board[x][y][z] === symbol)
								temp++;
							else if (board[x][y][z] !== '') {
								temp = 0;
								break;
							}
							total++;
							x += vector[0];
							y += vector[1];
							z += vector[2];
						}
						if (total == 4 && temp > longest_count) {
							longest_count = temp;
							longest_coords = { x: i, y: j, z: k };
							longest_vector = vector;
						}
					}
				}
			}
		}
		return { count: longest_count, coords: longest_coords, vector: longest_vector };
	}

	const makeMove = () => {
		// get longest line of own symbol that is not blocked
		// longest line constitutes: amount of symbols in a possible line without the occurrence of opponents symbols
		// get longest line of opponent symbol that is not blocked
		// if opponent line length <= self line length
			// continue self line
		// else
			// block opponent line
		// if no lines
			// place in random spot
		console.log(getLongestLine(board, symbol));
	}

	makeMove();

	return {
		board
	};
}