import useWSClient from "@/helpers/wsclient";
import { SetStateAction, useContext, useEffect } from "react";
import { PongContext } from "../PongProvider";
import { useGameState } from "./useGameState";

export const useWebSocket = ( setGameOver: { (value: SetStateAction<boolean>): void; (arg0: boolean): void; }) => {
	const wsClient = useWSClient();
	const { gameState, updateGameState, playerState, updatePlayerState } = useContext(PongContext);

	useEffect(() => {
		const waitForSocket = async () => {
			if (wsClient) {
				await wsClient.waitingForSocket();
				updateGameState({ ...gameState, gameId: "1", wsclient: wsClient });
			}
		};

		waitForSocket();
	}, [wsClient]);

	useEffect(() => {
		const joinTheGame = async () => {
			if (gameState.wsclient) {
				const clients =  await gameState.wsclient.joinGame(gameState.gameId);
				if (clients === 1) {
					const newPlayerState = {
						...playerState,
						master: true,
					}
					updatePlayerState(newPlayerState);
				}
			}
		};

		console.log(gameState, playerState.master);
		joinTheGame();
	}, [gameState.wsclient]);


	useEffect(() => {
		if (gameState.wsclient) {
			const setPause = (msg: string) => {
				if (msg === "2") {
					updateGameState({ ...gameState, pause: false });
				}
			};
			gameState.wsclient?.addMessageListener(`Players-${gameState.gameId}`, gameState.gameId, setPause)
		
			return () => {
				gameState.wsclient?.removeMessageListener(`Players-${gameState.gameId}`, gameState.gameId);
			} 
		}
	}, [gameState.wsclient]);

	// useEffect(() => {
	// 	if (gameState.wsclient) {
	// 		const setPause = (msg: string) => {
	// 			if (msg === "true")
	// 				updateGameState({ ...gameState, pause: true });
	// 		};
	// 		gameState.wsclient?.addMessageListener(`Pause-${gameState.gameId}`, gameState.gameId, setPause)
		
	// 		return () => {
	// 			gameState.wsclient?.removeMessageListener(`Pause-${gameState.gameId}`, gameState.gameId);
	// 		} 
	// 	}
	// }, [gameState.wsclient]);

	// useEffect(() => {
	// 	if (gameState.wsclient) {
	// 		if (keyMap['Escape']) {
	// 			console.log("Send Pause to opponent");
	// 			updateGameState({ ...gameState, pause: true })
	// 			gameState.wsclient?.emitMessageToGame("true", `Pause-${gameState.gameId}`, gameState.gameId);
	// 		}
	// 	}
	// }, [keyMap, gameState.wsclient]);
	
	useEffect(() => {
		if (gameState.wsclient) {
			console.log("Adding message listener for disconnecting player");
			const endGame = (msg: string) => {
				console.log("PLayer disconnected")
				setGameOver(true);
			};
			
			gameState.wsclient?.addMessageListener(`player-disconnected-${gameState.gameId}`, gameState.gameId, endGame)
			
			return () => {
				gameState.wsclient?.removeMessageListener(`player-disconnected-${gameState.gameId}`, gameState.gameId);
			}
		}
	}, [gameState.wsclient]);
}