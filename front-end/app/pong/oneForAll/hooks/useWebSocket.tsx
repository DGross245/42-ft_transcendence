import useWSClient from "@/helpers/wsclient";
import { useContext, useEffect, useState, Dispatch, SetStateAction } from "react";
import { PongContext } from "../../PongProvider";

export const useWebSocket = (isGameOver: Boolean, setGameOver: Dispatch<SetStateAction<boolean>>,
	disconnect: Boolean, setDisconnect: Dispatch<SetStateAction<boolean>>) => {
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
				const clients = await gameState.wsclient.joinGame(gameState.gameId, "OneForAll");
				let newPlayerData = { ...playerState };

				newPlayerData.players[clients] = {
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
					name: playerState.players[playerState.client].name,
					color: playerState.players[playerState.client].color,
					master: playerState.players[playerState.client].master,
					number: playerState.players[playerState.client].number,
				}
				console.log("SEND: ", playerData);
				gameState.wsclient?.emitMessageToGame(JSON.stringify(playerData), `PlayerData-${gameState.gameId}`, gameState.gameId);
			};
	
			sendPlayerData();
			updateGameState({ ...gameState, pause: false });
		}
	}, [playerState.client, isFull]);

	useEffect(() => {
		const setPause = (msg: string) => {
			if (msg === "FULL")
				setIsFull(msg);
		};

		if (gameState.wsclient) {
			gameState.wsclient?.addMessageListener(`Players-${gameState.gameId}`, gameState.gameId, setPause)

			return () => {
				gameState.wsclient?.removeMessageListener(`Players-${gameState.gameId}`, gameState.gameId);
			} 
		}
	}, [gameState.wsclient]);

	useEffect(() => {
		const setPlayer = (msg: string) => {
			const playerData = JSON.parse(msg);
			let newPlayerData = { ...playerState };
			const player = playerState.players.find(player => player.number === playerData.number);

			if (!player) {
				newPlayerData.players[playerData.number] = {
					name: playerData.name,
					color: playerData.color,
					master: playerData.master,
					number: playerData.number,
				}
				updatePlayerState( newPlayerData );
				console.log("NEW :", playerState)
			}
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
			const endGame = (msg: string) => {
				// setRequestRematch(false);
				// setSendRequest(false);

				if (!disconnect)
					setDisconnect(true);
				if (!isGameOver)
					setGameOver(true);
			};
			
			gameState.wsclient?.addMessageListener(`player-disconnected-${gameState.gameId}`, gameState.gameId, endGame)
			
			return () => {
				gameState.wsclient?.removeMessageListener(`player-disconnected-${gameState.gameId}`, gameState.gameId);
			}
		}
	}, [gameState.wsclient]);
}