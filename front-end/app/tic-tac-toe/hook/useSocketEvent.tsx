import { useEffect, useState } from "react";
import { useGameState } from "./useGameState";
import useWSClient from "@/helpers/wsclient";
import { useSocket } from "./useSocket";

export const useSocketEvent = () => {
	const newClient = useWSClient();
	const {
		wsclient,
		setWsclient,
		playerState,
		updatePlayerState,
		setDisconnected,
		setRematchIndex,
		setRequestRematch,
		setSendRequest,
		rematchIndex,
		sendRequest,
	} = useSocket();
	const { gameState, updateGameState, setWinner, isGameMode, botState, setBot } = useGameState();
	const [isFull, setIsFull] = useState("");
	const [playerSet, setPlayerSet] = useState(false);

	useEffect(() => {
		const waitForSocket = async () => {
			if (newClient) {
				await newClient.waitingForSocket();
				setWsclient(newClient);
				updateGameState({ ...gameState, gameId: "1"});
			}
		};

		waitForSocket();
	}, [newClient]);

	useEffect(() => {
		const joinTheGame = async () => {
			if (wsclient) {
				const numClients = await wsclient.joinGame(gameState.gameId, isGameMode ? "Qubic" : "TicTacToe", botState.isActive);
				let newPlayerData = { ...playerState };

				newPlayerData.players[numClients] = {
						name: "KEK",
						color: 0x00ff00,
						number: numClients,
						symbol: '',
				}
				newPlayerData.client = numClients
				updatePlayerState( newPlayerData );
				if (numClients !== 0)
					setBot({ ...botState, isActive: false })
			}
		};

		joinTheGame();
	}, [wsclient]);

	useEffect(() => {
		const sendPlayerData = () => {
			const playerData = {
				name: playerState.players[playerState.client].name,
				color: playerState.players[playerState.client].color,
				number: playerState.players[playerState.client].number,
				symbol: playerState.players[playerState.client].symbol,
			}
			wsclient?.emitMessageToGame(JSON.stringify(playerData), `PlayerData-${gameState.gameId}`, gameState.gameId);
		};

		if (playerState.client !== -1 && isFull === "FULL") {
			sendPlayerData();
			if (!isGameMode && botState.isActive)
				setPlayerSet(true);
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
			setPlayerSet(true);
		};

		if (wsclient) {
			wsclient?.addMessageListener(`PlayerData-${gameState.gameId}`, gameState.gameId, setPlayer)

			return () => {
				wsclient?.removeMessageListener(`PlayerData-${gameState.gameId}`, gameState.gameId);
			} 
		}
	},[wsclient, gameState.gameId, playerState, updatePlayerState]);

	useEffect(() => {
		if (wsclient) {
			const setPause = (msg: string) => {
				if (msg === "FULL") {
					setIsFull(msg);
				}
			};

			wsclient?.addMessageListener(`Players-${gameState.gameId}`, gameState.gameId, setPause)

			return () => {
				wsclient?.removeMessageListener(`Players-${gameState.gameId}`, gameState.gameId);
			} 
		}
	}, [wsclient]);

	
	useEffect(() => {
		if (wsclient) {
			const endGame = (msg: string) => {
				setDisconnected(true);
				setRequestRematch(false);
				setSendRequest(false);
				if (!gameState.gameOver) {
					setWinner(playerState.players[playerState.client].symbol);
					updateGameState({ ...gameState, gameOver: true});
				}
			};
			
			wsclient?.addMessageListener(`player-disconnected-${gameState.gameId}`, gameState.gameId, endGame)
			
			return () => {
				wsclient?.removeMessageListener(`player-disconnected-${gameState.gameId}`, gameState.gameId);
			}
		}
	}, [wsclient, playerState, gameState, gameState.gameOver]);

	useEffect(() => {
		if (wsclient) {
			const rematch = (msg: string) => {
				if (msg === "true") {
					setRematchIndex(rematchIndex + 1);
					setRequestRematch(true);
				}
			};
			
			wsclient?.addMessageListener(`Request-Rematch-${gameState.gameId}`, gameState.gameId, rematch)
			
			return () => {
				wsclient?.removeMessageListener(`Request-Rematch-${gameState.gameId}`, gameState.gameId);
			}
		}
	}, [wsclient, rematchIndex]);

	useEffect(() => {
		if (sendRequest) {
			setRematchIndex(rematchIndex + 1);
			wsclient?.emitMessageToGame("true", `Request-Rematch-${gameState.gameId}`, gameState.gameId);
		}
	}, [sendRequest]);

	useEffect(() => {
		if (wsclient) {
			const setPause = (msg: string) => {
				if (msg === "true")
					updateGameState({ ...gameState, pause: true });
				else
					updateGameState({ ...gameState, pause: false });
			};

			wsclient?.addMessageListener(`Pause-${gameState.gameId}`, gameState.gameId, setPause)
	
			return () => {
				wsclient?.removeMessageListener(`Pause-${gameState.gameId}`, gameState.gameId);
			} 
		}
	}, [wsclient]);

	useEffect(() => {
		const shuffleArray = (array: string[]) => {
			for (let i = array.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				let temp = array[i];
				array[i] = array[j];
				array[j] = temp
			}
			return array;
		};
	
		const sendRandomSymbol = () => {
			const symbols = shuffleArray(isGameMode ? ['X', 'O', '🔳'] : ['X', 'O']);
			const newPlayerState = { ...playerState };
			const botClientNumber = isGameMode ? 2 : 1;

			newPlayerState.players.forEach((player, index) => {
				player.symbol = symbols[index];
			});

			if (!botState.isActive || isGameMode)
				wsclient?.emitMessageToGame(JSON.stringify(symbols), `ShuffeledPlayer-${gameState.gameId}`, gameState.gameId);

			updatePlayerState({ ...newPlayerState });
			if (botState.isActive)
				setBot({ ...botState, symbol: playerState.players[botClientNumber].symbol })
		};
	
		if (playerSet && wsclient && playerState.client === 0) {
			sendRandomSymbol();
		}
	}, [playerSet]);

	useEffect(() => {
		const setSymbols = (msg: string) => {
			const newSymbols = JSON.parse(msg);
			const newPlayerState = { ... playerState };

			newPlayerState.players.forEach((player, index) => {
				player.symbol = newSymbols[index];
			});
			updatePlayerState(newPlayerState);
		};

		if (wsclient) {
			wsclient?.addMessageListener(`ShuffeledPlayer-${gameState.gameId}`, gameState.gameId, setSymbols)
			
			return () => {
				wsclient?.removeMessageListener(`ShuffeledPlayer-${gameState.gameId}`, gameState.gameId);
			}
		}
	}, [wsclient, playerState]);
};