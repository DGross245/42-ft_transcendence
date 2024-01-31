"use client"

import { Dispatch, SetStateAction } from "react";

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
// @todo create vector struct or delete this
interface Coordinate {
	x: number;
	y: number;
	z: number;
}

// strength: number between 0 and 1, indicating how well the bot plays
export const TicTacToeBot = ( board: string[][][], SymbolArray: string[], symbol: string, strength: number, setBoard: Dispatch<SetStateAction<string[][][]>>) => {

	function placeAtCoordinate(coords: Coordinate) {
		const newBoard = [...board];
		newBoard[coords.x][coords.y][coords.z] = symbol; 
		setBoard(newBoard);
	}

	function placeAtRandom() {
		const coords: Coordinate = {
			x: 0,
			y: 0,
			z: 0,
		}

		while (board[coords.x][coords.y][coords.z] !== '') {
			coords.x = Math.floor(Math.random() * board.length);
			coords.y = Math.floor(Math.random() * board.length);
			coords.z = Math.floor(Math.random() * board.length);
		}
		placeAtCoordinate(coords);
	}

	function getLongestLine(symbol_to_check: string) {
		let longest_count: number = 0;
		let longest_coords: Coordinate = { x: 0, y: 0, z: 0 };
		let longest_vector: number[] = [];
		for (let vector of win_vectors) {
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
							if (board[x][y][z] === symbol_to_check)
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
						if (total == board.length && temp > longest_count) {
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

	function placeAtLine(coords: Coordinate, vector: number[]) {
		while (board[coords.x][coords.y][coords.z] !== '') {
			coords.x += vector[0];
			coords.y += vector[1];
			coords.z += vector[2];
		}
		placeAtCoordinate(coords);
	}	

	function makeMove() {
		let longest_lines: { count: number; coords: Coordinate; vector: number[]; }[] = [];
		let self_index = 0;
		SymbolArray.forEach((val, index) => {
			longest_lines.push(getLongestLine(val));
			if (val === symbol)
				self_index = index;
		});
		console.log(longest_lines)
		if (Math.random() >= strength) {
			placeAtRandom();
			return ;
		}
		let longest_total = longest_lines[0];
		longest_lines.forEach((val) => {
			if (val.count > longest_total.count) {
				longest_total = val;
			}
		});
		if (longest_lines[self_index].count == longest_total.count)
			longest_total = longest_lines[self_index];	
		placeAtLine(longest_total.coords, longest_total.vector);
	}

	makeMove();

	return {
		board
	};
}