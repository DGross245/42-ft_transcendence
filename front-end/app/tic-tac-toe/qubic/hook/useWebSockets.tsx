import useWSClient from "@/helpers/wsclient";
import { useContext, useEffect, useState } from "react";
import { TTTContext } from "../../TTTProvider";

export const useWebSocket = ( isGameOver, setGameOver, setWinner, setDisable, setRequestRematch, setSendRequest, sendRequest ) => {
	const wsClient = useWSClient();
	const { gameState, updateGameState, playerState, updatePlayerState, } = useContext(TTTContext);
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
				const clients = await gameState.wsclient.joinGame(gameState.gameId, "Qubic");
				let newPlayerData = { ...playerState };

				newPlayerData.players[clients] = {
						name: "KEK",
						color: 0x00ff00,
						number: clients,
						symbol: clients === 0 ? 'X' : clients === 1 ? 'O' : '🔳',
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
					name: playerState.players[playerState.client].name,
					color: playerState.players[playerState.client].color,
					number: playerState.players[playerState.client].number,
					symbol: playerState.players[playerState.client].symbol,
				}
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

			newPlayerData.players[playerData.number] = {
					name: playerData.name,
					color: playerData.color,
					number: playerData.number,
					symbol: playerData.symbol,
			}
			updatePlayerState( newPlayerData );
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
				if (msg === "FULL") {
					setIsFull(msg);
				}
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
				setDisable(true);
				setRequestRematch(false);
				setSendRequest(false);
				if (!isGameOver) {
					setWinner(playerState.players[playerState.client].symbol);
					setGameOver(true);
				}
			};
			
			gameState.wsclient?.addMessageListener(`player-disconnected-${gameState.gameId}`, gameState.gameId, endGame)
			
			return () => {
				gameState.wsclient?.removeMessageListener(`player-disconnected-${gameState.gameId}`, gameState.gameId);
			}
		}
	}, [gameState.wsclient, playerState]);

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
};