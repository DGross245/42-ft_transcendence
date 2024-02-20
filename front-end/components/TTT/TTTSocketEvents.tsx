import { useEffect, useState } from "react";

import useWSClient from "@/helpers/wsclient";
import { useSound } from "@/components/hooks/Sound";
import { useSocket } from "@/app/tic-tac-toe/hooks/useSocket";
import { useGameState } from "@/app/tic-tac-toe/hooks/useGameState";
import useContract from "@/app/useContract";

export const TTTSocketEvents = () => {
	// Provider hooks
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
		continueIndex,
		setContinueIndex,
		sendContinueRequest,
		isFull,
		setIsFull,
		timerState,
		chipDisappear
	} = useSocket();
	const {
		gameState,
		updateGameState,
		setWinner,
		isGameMode,
		botState,
		setTournament,
		setBot,
	} = useGameState();

	// Normal hooks
	const newClient = useWSClient();
	const soundEngine = useSound();
	const {
		getPlayer,
		address
	} = useContract();

	// State variables
	// const [isFull, setIsFull] = useState("");
	const [playerSet, setPlayerSet] = useState(false);
	const [skip, setSkip] = useState({ _skip: false, address: "" })
	const [symbolSet, setSymbolSet] = useState(false);

	// Wait until socket is initialized
	useEffect(() => {
		const waitForSocket = async () => {
			if (newClient) {
				await newClient.waitingForSocket();
				newClient.sendAddress(address);
				setWsclient(newClient);
			}
		};

		waitForSocket();
	}, [newClient]);

	// Catches skip msg when player subscribed to a tournament is not present
	useEffect(() => {
		const skipGame = (msg: string) => {
			setSkip({ _skip: true, address: msg });
		};

		if (wsclient) {
			wsclient.listenToSkip(skipGame);
			return () => {
				wsclient?.removeSkipListener();
			} 
		}
	}, [wsclient]);


	useEffect(() => {
		if (timerState === 'cross') {
			setPlayerSet(true);
			// updateGameState({ ...gameState, pause: false })
		}
	}, [timerState])

	// Wait until a game is found
	useEffect(() => {
		const waiting = async () => {
			if (wsclient && gameState.gameId === "-1") {
				setIsFull("");
				setPlayerSet(false);
				const { gameID, tournamentId, gameIndex } = await wsclient.waitingRoom();
				if (tournamentId === -1 && !gameID.includes("Costume-Game-") && !isGameMode) {
					wsclient.joinQueue("TTT");
				} else {
					setTournament({ id: tournamentId, index: gameIndex })
				}
				updateGameState({ ...gameState, gameId: gameID });
			}
		}

		waiting();
	}, [wsclient, gameState.gameId]);

	// Initiate joining a game 
	useEffect(() => {
		const joinTheGame = async () => {
			if (wsclient && gameState.gameId !== "-1") {
				const player = await getPlayer(String(address))
				const numClients = await wsclient.joinGame(gameState.gameId, isGameMode ? "Qubic" : "TicTacToe", botState.isActive);
				let newPlayerData = { ...playerState };

				newPlayerData.players[numClients] = {
						name: player.name,
						addr: String(address),
						color: Number(player.color),
						number: numClients,
						symbol: 'Undefined',
				}
				newPlayerData.client = numClients

				// Handle the tournament case where a player subscribed to a tournament is not present
				if (skip._skip) {
					newPlayerData.players[1] = {
						name: "Unknown",
						addr: skip.address,
						color: 0xffffff,
						number: 1,
						symbol: 'Undefined',
					}
				}

				updatePlayerState( newPlayerData );
			}
		};

		joinTheGame();
	}, [wsclient, gameState.gameId]);

	// Initial communication between both players (SEND message)
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

	// Initial communication between both players (RECEIVE message)
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

			// Important for GameMode, array shouldn't be empty
			if (player && isGameMode) return ;

			setPlayerSet(true);
		};

		if (wsclient && gameState.gameId !== "-1") {
			wsclient?.addMessageListener(`PlayerData-${gameState.gameId}`, gameState.gameId, setPlayer)

			return () => {
				wsclient?.removeMessageListener(`PlayerData-${gameState.gameId}`, gameState.gameId);
			} 
		}
	},[wsclient, gameState.gameId, playerState]);

	// Update 'isFull' state when lobby is full
	useEffect(() => {
		const setPause = (msg: string) => {
			if (msg === "FULL")
				setIsFull(msg);
		};

		if (wsclient && gameState.gameId !== "-1") {
			wsclient?.addMessageListener(`Players-${gameState.gameId}`, gameState.gameId, setPause)

			return () => {
				wsclient?.removeMessageListener(`Players-${gameState.gameId}`, gameState.gameId);
			} 
		}
	
	}, [wsclient, gameState.gameId]);

	// Handle disconnect
	useEffect(() => {
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

		if (wsclient && gameState.gameId !== "-1") {
			if (skip._skip && gameState.gameId !== "-1" && symbolSet)
				endGame("SKIP");

			wsclient?.addMessageListener(`player-disconnected-${gameState.gameId}`, gameState.gameId, endGame)

			return () => {
				wsclient?.removeMessageListener(`player-disconnected-${gameState.gameId}`, gameState.gameId);
			}
		}
	}, [wsclient, playerState, gameState, gameState.gameOver, gameState.gameId]);

	// Handle rematch request
	useEffect(() => {
		const rematch = (msg: string) => {
			if (msg === "true") {
				setRematchIndex(rematchIndex + 1);
				setRequestRematch(true);
			}
		};

		if (wsclient && gameState.gameId !== '-1') {
			wsclient?.addMessageListener(`Request-Rematch-${gameState.gameId}`, gameState.gameId, rematch)

			return () => {
				wsclient?.removeMessageListener(`Request-Rematch-${gameState.gameId}`, gameState.gameId);
			}
		}
	}, [wsclient, rematchIndex, gameState.gameId]);

	// Send rematch request
	useEffect(() => {
		if (sendRequest) {
			const bot = botState.isActive ? 1 : 0;
			setRematchIndex(rematchIndex + 1 + bot);
			wsclient?.emitMessageToGame("true", `Request-Rematch-${gameState.gameId}`, gameState.gameId);
		}
	}, [sendRequest]);

	// Handle continue request
	useEffect(() => {
		const continueGame = (msg: string) => {
			if (msg === "true") {
				setContinueIndex(continueIndex + 1);
			}
		};

		if (wsclient && gameState.gameId !== '-1') {
			wsclient?.addMessageListener(`Continue-${gameState.gameId}`, gameState.gameId, continueGame)

			return () => {
				wsclient?.removeMessageListener(`Continue-${gameState.gameId}`, gameState.gameId);
			}
		}
	}, [wsclient, continueIndex, gameState.gameId]);

	// Send continue request
	useEffect(() => {
		if (sendContinueRequest) {
			const bot = botState.isActive ? 1 : 0;
			setContinueIndex(continueIndex + 1 + bot)
			wsclient?.emitMessageToGame("true", `Continue-${gameState.gameId}`, gameState.gameId);
		}
	}, [sendContinueRequest, wsclient, gameState.gameId]);

	// Send pause state
	useEffect(() => {
		if (gameState.pause && wsclient) {
			wsclient?.emitMessageToGame("true", `Pause-${gameState.gameId}`, gameState.gameId);
		}
	}, [gameState.pause]);

	// Pause listener
	useEffect(() => {
		const setPause = (msg: string) => {
			if (msg === "true")
				updateGameState({ ...gameState, pause: true });
		};

		if (wsclient && gameState.gameId !== "-1") {
			wsclient?.addMessageListener(`Pause-${gameState.gameId}`, gameState.gameId, setPause)

			return () => {
				wsclient?.removeMessageListener(`Pause-${gameState.gameId}`, gameState.gameId);
			} 
		}
	}, [wsclient, gameState.gameId]);

	// Master shuffles symbols
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
			setSymbolSet(true);
		};

		if (playerSet && playerState.client === 0) {
			sendRandomSymbol();
		}
	}, [playerSet, playerState.client]);

	// Opponents receive newly shuffled symbols
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