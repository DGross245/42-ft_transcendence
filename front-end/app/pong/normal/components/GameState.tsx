import { useContext, useEffect } from "react";
import { PongContext } from "../PongProvider";

export const useGameState = ( wsClient, keyMap, setGameOver ) => {
	const { gameState, updateGameState, playerState, updatePlayerState } = useContext(PongContext);

	// Just for testing, need to be moved somewhere else (matchmaking ?)
	useEffect(() => {
		updateGameState({ ...gameState, gameId: "1", wsclient: wsClient });
	}, [wsClient]);

	useEffect(() => {
		if (gameState.wsclient && gameState.wsclient.connected()) {
			console.log("Adding message listener for full lobby");
			const setPause = (msg: string) => {
				console.log("Check if FULL");
				if (msg === "2") {
					updateGameState({ ... gameState, pause: false });
				}
			};
			
			gameState.wsclient?.addMessageListener(`Players-${gameState.gameId}`, gameState.gameId, setPause)
		
			return () => {
				gameState.wsclient?.removeMessageListener(`Players-${gameState.gameId}`, gameState.gameId);
			} 
		}
	}, [gameState.wsclient]);
	
	
	// Set Pause on Key press and send it to opponent
	useEffect(() => {
		if (keyMap['Escape']) {
			console.log("Send Pause to opponent");
			updateGameState({ ...gameState, pause: true })
			gameState.wsclient?.emitMessageToGame("true", 'Pause', gameState.gameId);
		}
	}, [keyMap]);
	
	useEffect(() => {
		if (gameState.wsclient && gameState.wsclient.connected()) {
			console.log("Adding message listener for disconnecting player");
			const endGame = (msg: string) => {
				console.log("PLayer disconnected")
				setGameOver(true);
			};
			
			gameState.wsclient?.addMessageListener(`player-disconnected-1}`, gameState.gameId, endGame)
			
			return () => {
				gameState.wsclient?.removeMessageListener(`player-disconnected-${gameState.gameId}`, gameState.gameId);
			}
		}
	}, [gameState.wsclient]);

	const joinGameIfNeeded = async () => {
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
		
	// maybe also move to somewhere else
	useEffect(() => {
		console.log(gameState, playerState.master);
		joinGameIfNeeded();
	}, [gameState.wsclient]);

	return (1);
}