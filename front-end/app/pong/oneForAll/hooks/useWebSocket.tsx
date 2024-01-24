import useWSClient from "@/helpers/wsclient";
import { useContext, useEffect } from "react";
import { PongContext } from "../../PongProvider";

export const useWebSocket = () => {
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
				const clients = await gameState.wsclient.joinGame(gameState.gameId, "OneForAll");

				const updatedPlayers = [
					...playerState.players.slice(0, clients),
					{ ...playerState.players[clients], master: clients === 0, number: clients },
					...playerState.players.slice(clients + 1),
				];

				updatePlayerState({
					players: updatedPlayers,
					client: clients,
				});
			}
		};

		joinTheGame();
	}, [gameState.wsclient]);

	useEffect(() => {
		const sendPlayerData = () => {
			// //TODO: Need to be replaced late with a real setter
			const playerData = {
				name: playerState.players[playerState.client].name,
				number: playerState.players[playerState.client].number,
				color: playerState.players[playerState.client].color,
			}
			gameState.wsclient?.emitMessageToGame(JSON.stringify(playerData), `PlayerData-${gameState.gameId}`, gameState.gameId);
		};

		const setPause = (msg: string) => {
			if (msg === "3") {
				sendPlayerData();
				updateGameState({ ...gameState, pause: false });
			}
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
			const player = playerState.players.find(player => player.number === playerData.number);

			console.log(playerState)
			if (!player) {
				const newPlayerData = [ ...playerState.players ];
				newPlayerData[playerData.number] = {
					name: playerData.name,
					number: playerData.number,
					color: playerData.color,
					master: playerData.master,
				}
				updatePlayerState({ ...playerState, players: newPlayerData });
			}
		};

		if (gameState.wsclient) {
			gameState.wsclient?.addMessageListener(`PlayerData-${gameState.gameId}`, gameState.gameId, setPlayer)

			return () => {
				gameState.wsclient?.removeMessageListener(`Players-${gameState.gameId}`, gameState.gameId);
			} 
		}
	},[gameState.wsclient]);

	// DISCONNECT HANDLER


}