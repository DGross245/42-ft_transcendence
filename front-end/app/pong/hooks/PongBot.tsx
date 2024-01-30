"use client"

import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { Vector3 } from 'three';

interface usePongBot {
	active: boolean;
	delay: number;
	paddlePosition: Vector3;
}

export enum Direction {
	Up,
	Stop,
	Down,
}

export const usePongBot = ( active: boolean, delay: number, paddlePosition: Vector3 ) => {
	const [direction, setDirection] = useState(Direction.Stop);

	// Calculates the bot's paddle movement direction based on the ball's position.
	const calculateBotMove = (ballPosition: number, botPaddlePosition: number) => {
		if (ballPosition) {
			setTimeout(() => {
				if (ballPosition >= botPaddlePosition - 15 && ballPosition <= botPaddlePosition + 15) {
					setDirection(Direction.Stop);
				}
				else if (Math.round(ballPosition) > botPaddlePosition) {
					setDirection(Direction.Up);
				}
				else if (ballPosition < botPaddlePosition) {
					setDirection(Direction.Down);
				}
			}, delay);
		}
	}

	const ballAidsHook = (position: Vector3) => {
		if (position.y) {
			const ballPositionY = position.y as number;
			const botPaddlePositionY = paddlePosition.y as number;
			calculateBotMove(ballPositionY, botPaddlePositionY);
		}
	}

	return {
		active,
		direction,
		ballAidsHook
	};
}
