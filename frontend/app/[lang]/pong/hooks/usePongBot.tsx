"use client"

import { useCallback, useEffect, useState } from 'react';
import { Vector3 } from 'three';

import { usePongGameState } from './usePongGameState';
import { usePongSocket } from './usePongSocket';

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

export const usePongBot = () => {
	const [direction, setDirection] = useState(Direction.Stop);
	const { botState, rightPaddleRef, isGameMode, setBot } = usePongGameState();
	const { wsclient, setPlayerState } = usePongSocket();

	// Calculates the bot's paddle movement direction based on the ball's position.
	const calculateBotMove = useCallback((ballPosition: number, botPaddlePosition: number) => {
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
			}, botState.strength);
		}
	}, [botState.strength]);

	const ballAidsHook = useCallback((position: Vector3) => {
		if (position.z) {
			const ballPositionZ = position.z as number;
			const botPaddlePositionZ = rightPaddleRef.current.position.z as number;
			calculateBotMove(ballPositionZ, botPaddlePositionZ);
		}
	}, [rightPaddleRef, calculateBotMove])

	useEffect(() => {
		const joinTheGame = () => {
			if (wsclient) {
				const client = isGameMode ? 3 : 1;

				setPlayerState((prevState) => {
					const updatedPlayers = prevState.players.map((prevPlayer, index) => {
						if (index === client) {
							return {
								name: "BOT",
								addr: "0xBotBOB01245",
								color: 0xff0000,
								number: client,
							};
						} else {
							return ( prevPlayer );
						}
					});

					return { ...prevState, players: updatedPlayers };
				});

				setBot({ ...botState, client: client })
			}
		}

		if (botState.isActive && wsclient) {
			joinTheGame();
		}
	},[botState, wsclient, isGameMode, setBot, setPlayerState])

	return {
		direction,
		ballAidsHook
	};
}