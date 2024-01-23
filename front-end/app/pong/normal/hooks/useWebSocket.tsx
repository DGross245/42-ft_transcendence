import useWSClient from "@/helpers/wsclient";
import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { PongContext } from "../PongProvider";

// TODO: Add a paus when document is hidden

export const useWebSocket = (isGameOver: Boolean, sendRequest: Boolean, setGameOver: Dispatch<SetStateAction<boolean>>, setRequestRematch: Dispatch<SetStateAction<boolean>>, setSendRequest: Dispatch<SetStateAction<boolean>>) => {
	const wsClient = useWSClient();
	const { gameState, updateGameState, playerState, updatePlayerState, } = useContext(PongContext);

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
					const newPlayerState = { ...playerState, master: true }
					updatePlayerState( newPlayerState );
				}
			}
		};

		joinTheGame();
	}, [gameState.wsclient]);


	useEffect(() => {
		if (gameState.wsclient) {
			const setPause = (msg: string) => {
				if (msg === "2")
					updateGameState({ ...gameState, pause: false });
			};

			gameState.wsclient?.addMessageListener(`Players-${gameState.gameId}`, gameState.gameId, setPause)

			return () => {
				gameState.wsclient?.removeMessageListener(`Players-${gameState.gameId}`, gameState.gameId);
			} 
		}
	}, [gameState.wsclient]);

	
	useEffect(() => {
		if (gameState.wsclient) {
			const endGame = (msg: string) => {
				setRequestRematch(false);
				setSendRequest(false);
				if (!isGameOver)
					setGameOver(true);
			};
			
			gameState.wsclient?.addMessageListener(`player-disconnected-${gameState.gameId}`, gameState.gameId, endGame)
			
			return () => {
				gameState.wsclient?.removeMessageListener(`player-disconnected-${gameState.gameId}`, gameState.gameId);
			}
		}
	}, [gameState.wsclient]);

	useEffect(() => {
		if (gameState.wsclient) {
			const rematch = (msg: string) => {
				if (msg === "true")
					setRequestRematch(true);
			};
			
			gameState.wsclient?.addMessageListener(`Request-Rematch-${gameState.gameId}`, gameState.gameId, rematch)
			
			return () => {
				gameState.wsclient?.removeMessageListener(`Request-Rematch-${gameState.gameId}`, gameState.gameId);
			}
		}
	}, [gameState.wsclient]);

	useEffect(() => {
		if (sendRequest)
			gameState.wsclient?.emitMessageToGame("true", `Request-Rematch-${gameState.gameId}`, gameState.gameId);
	}, [sendRequest]);

	// useEffect(() => {
	// 	if (gameState.wsclient) {
	// 		const setPause = (msg: string) => {
	// 			if (msg === "true")
	// 				updateGameState({ ...gameState, pause: true });
	// 			else
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
	// 			if ()
	// 				updateGameState({ ...gameState, pause: true })
	// 				gameState.wsclient?.emitMessageToGame("true", `Pause-${gameState.gameId}`, gameState.gameId);
	// 		}
	// 	}
	// }, [keyMap, gameState.wsclient]);

}