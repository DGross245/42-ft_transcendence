import useWSClient from "@/helpers/wsclient";
import { useEffect, useState } from "react";
import { usePongSocket } from "./usePongSocket";
import { usePongGameState } from "./usePongGameState";

export const usePongSocketEvents = () => {
	const newClient = useWSClient();
	const {
		setWsclient,
		wsclient,
		playerState,
		setPlayerState,
		disconnected,
		setDisconnected,
		sendRequest,
		setRematchIndex,
		rematchIndex,
		setRequestRematch,
		setSendRequest
	} = usePongSocket();
	const { pongGameState, setPongGameState, isGameMode } = usePongGameState();
	const [isFull, setIsFull] = useState("");

	useEffect(() => {
		const waitForSocket = async () => {
			if (newClient) {
				await newClient.waitingForSocket();
				setWsclient(newClient);
				setPongGameState({ ...pongGameState, gameId: "0"});
			}
		};

		waitForSocket();
	}, [newClient]);

	useEffect(() => {
		const joinTheGame = async () => {
			if (wsclient) {
				const clients = await wsclient.joinGame(pongGameState.gameId, isGameMode ? "OneForAll" : "Pong", false);
				let newPlayerData = { ...playerState };

				newPlayerData.players[clients] = {
						name: "KEK",
						color: 0x00ff00,
						number: clients
				},
				newPlayerData.master = clients === 0 ? true : false,
				newPlayerData.client = clients
				setPlayerState( newPlayerData );
			}
		};

		joinTheGame();
	}, [wsclient]);

	useEffect(() => {
		if (playerState.client !== -1 && isFull === "FULL") {
			const sendPlayerData = () => {
				const playerData = {
					name: playerState.players[playerState.client].name,
					color: playerState.players[playerState.client].color,
					number: playerState.players[playerState.client].number,
				}
				wsclient?.emitMessageToGame(JSON.stringify(playerData), `PlayerData-${pongGameState.gameId}`, pongGameState.gameId);
			};

			sendPlayerData();
			setPongGameState({ ...pongGameState, pause: false });
		}
	}, [playerState.client, isFull]);

	useEffect(() => {
		const setPause = (msg: string) => {
			if (msg === "FULL")
				setIsFull(msg);
		};

		if (wsclient) {
			wsclient?.addMessageListener(`Players-${pongGameState.gameId}`, pongGameState.gameId, setPause)

			return () => {
				wsclient?.removeMessageListener(`Players-${pongGameState.gameId}`, pongGameState.gameId);
			} 
		}
	}, [wsclient]);

	useEffect(() => {
		const setPlayer = (msg: string) => {
			const playerData = JSON.parse(msg);
			let newPlayerData = { ...playerState };
			const player = playerState.players.find(player => player.number === playerData.number);

			if (!player) {
				newPlayerData.players[playerData.number] = {
					name: playerData.name,
					color: playerData.color,
					number: playerData.number,
				}
				setPlayerState( newPlayerData );
			}
		};

		if (wsclient) {
			wsclient?.addMessageListener(`PlayerData-${pongGameState.gameId}`, pongGameState.gameId, setPlayer)

			return () => {
				wsclient?.removeMessageListener(`PlayerData-${pongGameState.gameId}`, pongGameState.gameId);
			} 
		}
	},[wsclient, pongGameState.gameId, playerState]);

	useEffect(() => {
		if (wsclient) {
			const endGame = (msg: string) => {
				setRequestRematch(false);
				setSendRequest(false);

				if (!disconnected)
					setDisconnected(true);
				if (!pongGameState.gameOver)
					setPongGameState({ ...pongGameState, gameOver: true });
			};

			wsclient?.addMessageListener(`player-disconnected-${pongGameState.gameId}`, pongGameState.gameId, endGame)
			
			return () => {
				wsclient?.removeMessageListener(`player-disconnected-${pongGameState.gameId}`, pongGameState.gameId);
			}
		}
	}, [wsclient, disconnected, pongGameState.gameOver]);

	useEffect(() => {
		if (wsclient) {
			const rematch = (msg: string) => {
				if (msg === "true") {
					setRematchIndex(rematchIndex + 1);
					setRequestRematch(true);
				}
			};

			wsclient?.addMessageListener(`Request-Rematch-${pongGameState.gameId}`, pongGameState.gameId, rematch)

			return () => {
				wsclient?.removeMessageListener(`Request-Rematch-${pongGameState.gameId}`, pongGameState.gameId);
			}
		}
	}, [wsclient, rematchIndex]);

	useEffect(() => {
		if (sendRequest) {
			setRematchIndex(rematchIndex + 1);
			wsclient?.emitMessageToGame("true", `Request-Rematch-${pongGameState.gameId}`, pongGameState.gameId);
		}
	}, [sendRequest]);
}