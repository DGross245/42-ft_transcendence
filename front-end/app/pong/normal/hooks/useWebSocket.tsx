import useWSClient from "@/helpers/wsclient";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { PongContext } from "../../PongProvider";

// TODO: Add a paus when document is hidden

export const useWebSocket = (isGameOver: Boolean, sendRequest: Boolean, setGameOver: Dispatch<SetStateAction<boolean>>, setRequestRematch: Dispatch<SetStateAction<boolean>>, setSendRequest: Dispatch<SetStateAction<boolean>>) => {
	const wsClient = useWSClient();
	const { gameState, updateGameState, playerState, updatePlayerState, } = useContext(PongContext);
	const [isFull, setIsFull] = useState("");

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
				const clients = await gameState.wsclient.joinGame(gameState.gameId, "Pong");
				let newPlayerData = { ...playerState };

				newPlayerData.players[0] = {
						name: "KEK",
						color: 0x00ff00,
						master: clients === 0 ? true : false,
						number: clients,
				}
				newPlayerData.client = clients
				updatePlayerState( newPlayerData );
			}
		};

		joinTheGame();
	}, [gameState.wsclient]);

	useEffect(() => {
		if (playerState.client !== -1 && isFull === "FULL") {
			const sendPlayerData = () => {
				const playerData = {
					name: playerState.players[0].name,
					color: playerState.players[0].color,
					master: playerState.players[0].master,
					number: playerState.players[0].number,
				}
				console.log("SEND: ", playerData);
				gameState.wsclient?.emitMessageToGame(JSON.stringify(playerData), `PlayerData-${gameState.gameId}`, gameState.gameId);
			};
	
			sendPlayerData();
			updateGameState({ ...gameState, pause: false });
		}
	}, [playerState.client, isFull]);

	useEffect(() => {
		const setPlayer = (msg: string) => {
			const playerData = JSON.parse(msg);
			let newPlayerData = { ...playerState };

			newPlayerData.players[1] = {
					name: playerData.name,
					color: playerData.color,
					master: playerData.master,
					number: playerData.number,
			}
			updatePlayerState( newPlayerData );
			console.log("NEW :", playerState)
		};

		if (gameState.wsclient) {
			gameState.wsclient?.addMessageListener(`PlayerData-${gameState.gameId}`, gameState.gameId, setPlayer)

			return () => {
				gameState.wsclient?.removeMessageListener(`PlayerData-${gameState.gameId}`, gameState.gameId);
			} 
		}
	},[gameState.wsclient, gameState.gameId, playerState, updatePlayerState]);

	useEffect(() => {
		if (gameState.wsclient) {
			const setPause = (msg: string) => {
				if (msg === "FULL")
					setIsFull(msg);
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

	useEffect(() => {
		if (gameState.wsclient) {
			const setPause = (msg: string) => {
				if (msg === "true")
					updateGameState({ ...gameState, pause: true });
				else
					updateGameState({ ...gameState, pause: false });
			};
			gameState.wsclient?.addMessageListener(`Pause-${gameState.gameId}`, gameState.gameId, setPause)
	
			return () => {
				gameState.wsclient?.removeMessageListener(`Pause-${gameState.gameId}`, gameState.gameId);
			} 
		}
	}, [gameState.wsclient]);

}