import useWSClient from "@/helpers/wsclient";
import { useContext, useEffect, useState } from "react";
import { PongContext } from "../../PongProvider";

export const useWebSocket = () => {
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
		if (playerState.client !== -1 && isFull === "FULL") {
			const sendPlayerData = () => {
				const playerData = {
					name: playerState.players[playerState.client].name,
					color: playerState.players[playerState.client].color,
					master: playerState.players[playerState.client].master,
					number: playerState.players[playerState.client].number,
				}
				console.log("SENDING ", playerData);
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
			console.log("GOT DATA: ", playerData);
			const player = playerState.players.find(player => player.number === playerData.number);

			// FIXME: Doesnt update the updatePlayerState correctly (Somehow each old state is deleted)
			if (!player) {
				let newPlayerData = JSON.parse(JSON.stringify(playerState));
				newPlayerData.players[playerData.number] = {
					name: playerData.name,
					color: playerData.color,
					master: playerData.master,
					number: playerData.number,
				}
				console.log(newPlayerData)
				updatePlayerState( newPlayerData );
			}
		};

		if (gameState.wsclient) {
			gameState.wsclient?.addMessageListener(`PlayerData-${gameState.gameId}`, gameState.gameId, setPlayer)

			return () => {
				gameState.wsclient?.removeMessageListener(`PlayerData-${gameState.gameId}`, gameState.gameId);
			} 
		}
	},[gameState.wsclient]);

	// DISCONNECT HANDLER

}