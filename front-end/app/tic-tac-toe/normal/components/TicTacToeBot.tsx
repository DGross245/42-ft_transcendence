// bot logic
	// get longest line of own symbol that is not blocked
		// longest line constitutes: amount of symbols in a possible line without the occurrence of opponents symbols
	// get longest line of opponent symbol that is not blocked
	// if opponent line length <= self line length
		// continue self line
	// else
		// block opponent line
	// if no lines
		// place in random spot

"use client"

import React, { MutableRefObject, useEffect, useRef, useState } from 'react';

// should be 13
const line_vectors = [
	// one dimensionals
	[ 1, 0, 0 ],
	[ 0, 1, 0 ],
	[ 0, 0, 1 ],

	// two dimensional diagonals
	[ 1, 1, 0 ],
	[-1, 1, 0 ],

	// x-z diagonals
	[ 1, 0, 1 ],
	[ 1, 0,-1 ],

	// y-z diagonals
	[ 0, 1, 1 ],
	[ 0, 1,-1 ],

	// three dimensional diagonals
	[ 1, 1, 1 ],
	[-1, 1, 1 ],
	[ 1,-1, 1 ],
	[ 1, 1,-1 ],
]; // @note vectors representing possible winning lines

interface TicTacToeBot {
	board: string[][][];
	symbol: string;
}

export const TicTacToeBot = ( board: string[][][], symbol: string ) => {

	const getLongestLine = (board: string[][][], symbol: string) => {
		for (const vector of line_vectors) {
			for (let i = 0; i < board.length; i++) {
				for (let j = 0; j < board[i].length; j++) {
					for (let k = 0; k < board[i][j].length; k++) {

					}
				}
			}
		}
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
	}

	return {
		board
	};
}