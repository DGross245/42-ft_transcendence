import { useEffect, useState } from "react";

import useWSClient from "@/helpers/wsclient";
import { useSound } from "@/components/hooks/Sound";
import { useSocket } from "@/app/tic-tac-toe/hooks/useSocket";
import { useGameState } from "@/app/tic-tac-toe/hooks/useGameState";
import { useWeb3ModalAccount } from "@web3modal/ethers5/react";

export const TTTSocketEvents = (address) => {
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
		sendRequest } = useSocket();
	const {
		gameState,
		updateGameState,
		setWinner,
		isGameMode,
		botState,
		setTournament,
		setBot } = useGameState();
	const [isFull, setIsFull] = useState("");
	const [playerSet, setPlayerSet] = useState(false);
	const soundEngine = useSound();

	useEffect(() => {
		const waitForSocket = async () => {
			if (newClient) {
				await newClient.waitingForSocket();
				newClient?.sendAddress(address);
				setWsclient(newClient);
			}
		};

		waitForSocket();
	}, [newClient]);

	useEffect(() => {
		const waiting = async () => {
			if (wsclient && gameState.gameId === "-1") {
				setIsFull("");
				setPlayerSet(false);
				const { gameID, tournamentId, gameIndex} = await wsclient.waitingRoom();
				if (tournamentId === -1 && !gameID.includes("Costume-Game-")) {// TODO: Need to be edited for custome games (add another condition)
					wsclient.joinQueue(isGameMode ? "Qubic" : "TTT");
					console.log("QUEEUE")
				} else {
					console.log(tournamentId, gameIndex)
					setTournament({ id: tournamentId, index: gameIndex })
				}
				// wsclient.updateStatus(true);
				updateGameState({ ...gameState, gameId: gameID});
			}
		}

		waiting();
	}, [wsclient, gameState.gameId]);

	useEffect(() => {
		const joinTheGame = async () => {
			if (wsclient) {
				if (address) {
					const { walletAddress } = address;
					const numClients = await wsclient.joinGame(gameState.gameId, isGameMode ? "Qubic" : "TicTacToe", botState.isActive);
					let newPlayerData = { ...playerState };
	
					newPlayerData.players[numClients] = {
							name: "KEK",
							addr: walletAddress,
							color: 0xffffff,
							number: numClients,
							symbol: 'Undefined',
					}
					newPlayerData.client = numClients
					updatePlayerState( newPlayerData );
				}
			}
		};

		if (wsclient && gameState.gameId !== "-1")
			joinTheGame();
	}, [wsclient, gameState.gameId]);

	useEffect(() => {
		const sendPlayerData = () => {
			const playerData = {
				name: playerState.players[playerState.client].name,
				addr: playerState.players[playerState.client].addr,
				color: playerState.players[playerState.client].color,
				number: playerState.players[playerState.client].number,
				symbol: playerState.players[playerState.client].symbol,
			}
			wsclient?.emitMessageToGame(JSON.stringify(playerData), `PlayerData-${gameState.gameId}`, gameState.gameId);
		};

		if (playerState.client !== -1 && isFull === "FULL") {
			sendPlayerData();
			if (botState.isActive && !isGameMode)
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
					addr: playerData.addr,
					color: playerData.color,
					number: playerData.number,
					symbol: playerData.symbol,
			}
			updatePlayerState( newPlayerData );

			const player = playerState.players.find(player => player.name === "None");
			if (player && isGameMode) return ;

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
		if (wsclient && gameState.gameId !== "-1") {
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
	
	}, [wsclient, gameState.gameId]);

	useEffect(() => {
		if (wsclient && gameState.gameId !== "-1") {
			const endGame = (msg: string) => {
				setDisconnected(true);
				setRequestRematch(false);
				setSendRequest(false);
				soundEngine?.playSound("door");
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
	}, [wsclient, playerState, gameState, gameState.gameOver, gameState.gameId]);

	useEffect(() => {
		const rematch = (msg: string) => {
			if (msg === "true") {
				setRematchIndex(rematchIndex + 1);
				setRequestRematch(true);
			}
		};

		if (wsclient) {
			wsclient?.addMessageListener(`Request-Rematch-${gameState.gameId}`, gameState.gameId, rematch)
			
			return () => {
				wsclient?.removeMessageListener(`Request-Rematch-${gameState.gameId}`, gameState.gameId);
			}
		}
	}, [wsclient, rematchIndex, gameState.gameId]);

	useEffect(() => {
		if (sendRequest) {
			const bot = botState.isActive ? 1 : 0;
			setRematchIndex(rematchIndex + 1 + bot);
			wsclient?.emitMessageToGame("true", `Request-Rematch-${gameState.gameId}`, gameState.gameId);
		}
	}, [sendRequest]);

	useEffect(() => {
		if (gameState.pause && wsclient) {
			wsclient?.emitMessageToGame("true", `Pause-${gameState.gameId}`, gameState.gameId);
		}
	}, [gameState.pause]);

	useEffect(() => {
		if (wsclient && gameState.gameId !== "-1") {
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
	}, [wsclient, gameState.gameId]);

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
	
		if (playerSet && playerState.client === 0) {
			sendRandomSymbol();
		}
	}, [playerSet, playerState.client]);

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

	return (null);
};