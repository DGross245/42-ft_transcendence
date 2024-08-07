import { memo, useContext, useEffect, useState } from "react";

import useWSClient, { WSClientType } from "@/helpers/wsclient";
import { useSound } from "@/components/hooks/Sound";
import { useSocket } from "@/app/[lang]/tic-tac-toe/hooks/useSocket";
import { useGameState } from "@/app/[lang]/tic-tac-toe/hooks/useGameState";
import useContract from "@/components/hooks/useContract";
import { useRouter } from "next/navigation";
import guestContext from "@/app/[lang]/guestProvider";

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

export const TTTSocketEvents = memo(() => {
	//* ------------------------------- hooks ------------------------------ */
	const {
		wsclient,
		setWsclient,
		playerState,
		setPlayerState,
		setPlayerStatus,
		setRematchIndex,
		setRequestRematch,
		setSendRequest,
		sendRequest,
		setContinueIndex,
		sendContinueRequest,
		isFull,
		setIsFull,
		timerState,
		setTimerState,
		customized,
		setPlayerAddress,
	} = useSocket();
	const {
		gameState,
		updateGameState,
		setWinner,
		isGameMode,
		botState,
		setTournament,
		setBot,
		tournament,
	} = useGameState();
	const {
		getPlayer,
		address
	} = useContract();
	const newClient = useWSClient();
	const playSound = useSound();
	const router = useRouter();
	const { isGuest } = useContext(guestContext);

	//* ------------------------------- state variables ------------------------------ */
	const [playerSet, setPlayerSet] = useState(false);
	const [skip, setSkip] = useState({ _skip: false, address: "" })
	const [symbolSet, setSymbolSet] = useState(false);

	//* ------------------------------- useEffects ------------------------------ */

	// Wait until socket is initialized
	useEffect(() => {
		const waitForSocket = async () => {
			if (newClient) {
				await newClient.waitingForSocket();
				newClient.sendAddress(isGuest ? '0xGUEST' : address);
				setWsclient(newClient as WSClientType);
				setPlayerAddress(String(isGuest ? '0xGUEST' : address));
			}
		};

		waitForSocket();
	}, [newClient, address, isGuest, setWsclient, setPlayerAddress]);

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

	// Wait until a game is found
	useEffect(() => {
		const waiting = async () => {
			if (wsclient && gameState.gameId === "-1") {
				setSkip({ _skip: false, address: ""});
				setIsFull('');
				setTimerState('');
				setPlayerSet(false);
				setPlayerStatus("");
				setSymbolSet(false);

				const { gameID, tournamentId, gameIndex } = await wsclient.waitingRoom();
				if (tournamentId === -1 && !gameID.includes("Custom-Game-") && !isGameMode) {
					wsclient.joinQueue("TTT");
				} else {
					setTournament({ id: tournamentId, index: gameIndex });
				}
				updateGameState({ gameId: gameID });
			}
		}

		waiting();
	}, [wsclient, gameState.gameId, isGameMode, setIsFull, setTournament, updateGameState, setTimerState, setPlayerStatus]);

	// Initiate joining a game 
	useEffect(() => {
		const joinTheGame = async () => {
			if (wsclient && gameState.gameId !== "-1") {
				let player = { addr: '0xGUEST', name: 'Guest', color: '0xffffff'};
				if (!isGuest) {
					player = await getPlayer(String(address))
				}
				const numClients = await wsclient.joinGame(gameState.gameId, isGameMode ? "Qubic" : "TicTacToe", botState.isActive);

				setPlayerState((prevState) => {
					const updatedPlayers = prevState.players.map((prevPlayer, index) => {
						if (index === numClients) {
							return {
								name: player.name,
								addr: String(isGuest ? '0xGUEST' : address),
								color: Number(player.color),
								number: numClients,
								symbol: numClients === 0 ? 'X' : numClients === 1 ? 'O' : '🔳',
							};
						} else {
							return ( prevPlayer );
						}
					});

					const newState = {
						...prevState,
						players: updatedPlayers,
						client: numClients
					};

					// Handle the tournament case where a player subscribed to a tournament is not present
					if (skip._skip && numClients === 0) {
						newState.players[1] = {
							name: "Unknown",
							addr: skip.address,
							color: 0xffffff,
							number: 1,
							symbol: "O"
						};
					}

					return ( newState );
				});
			}
		};

		if (customized && (isGuest || address)) {
			joinTheGame();
		}
	}, [wsclient, customized, gameState.gameId, address, botState.isActive, isGameMode, isGuest, skip, setPlayerState, getPlayer]);

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
			if (botState.isActive && playerState.client === 0 && isGameMode) {
				const botData = {
					name: playerState.players[botState.client].name,
					addr: playerState.players[botState.client].addr,
					color: playerState.players[botState.client].color,
					number: playerState.players[botState.client].number,
					symbol: playerState.players[botState.client].symbol,
				}
				wsclient?.emitMessageToGame(JSON.stringify(botData), `PlayerData-${gameState.gameId}`, gameState.gameId);
			}
		};

		if (playerState.client !== -1 && isFull === "FULL") {
			sendPlayerData();
			if (botState.isActive && !isGameMode) {
				setPlayerSet(true);
			}
			// updateGameState({ pause: false });
		}
	}, [playerState.client, isFull, botState, gameState.gameId, playerState.players, isGameMode, wsclient]);

	// Initial communication between both players (RECEIVE message)
	useEffect(() => {
		const setPlayer = (msg: string) => {
			const playerData = JSON.parse(msg);
			const player = playerState.players.find(player => player.number === playerData.number);

			if (!player) {
				setPlayerState((prevState) => {
					const updatedPlayers = prevState.players.map((prevPlayer, index) => {
						if (index === playerData.number) {
							return {
								name: playerData.name,
								addr: playerData.addr,
								color: playerData.color,
								number: playerData.number,
								symbol: playerData.symbol,
							};
						} else {
							return ( prevPlayer );
						}
					});

					return { ...prevState, players: updatedPlayers };
				});

				if (playerData.addr === "0xBotBOB01245") {
					setBot((prevState) => ({ ...prevState, isActive: true }));
				}
			}

			const notSetPlayer = playerState.players.find(player => player.name === "None");

			// Important for GameMode, array shouldn't be empty
			if (notSetPlayer && isGameMode) return ;

			setPlayerSet(true);
		};

		if (wsclient && gameState.gameId !== "-1") {
			wsclient?.addMessageListener(`PlayerData-${gameState.gameId}`, gameState.gameId, setPlayer)

			return () => {
				wsclient?.removeMessageListener(`PlayerData-${gameState.gameId}`, gameState.gameId);
			} 
		}
	},[wsclient, gameState.gameId, playerState.players, isGameMode, setBot, setPlayerState]);

	// Update 'isFull' state when lobby is full
	useEffect(() => {
		const setPause = (msg: string) => {
			if (msg === "FULL") {
				setIsFull(msg);
			}
		};

		if (wsclient && gameState.gameId !== "-1") {
			wsclient?.addMessageListener(`Players-${gameState.gameId}`, gameState.gameId, setPause)

			return () => {
				wsclient?.removeMessageListener(`Players-${gameState.gameId}`, gameState.gameId);
			} 
		}
	
	}, [wsclient, gameState.gameId, setIsFull]);

	// Handle disconnect
	useEffect(() => {
		const endGame = (msg: string) => {
			setRequestRematch(false);
			setSendRequest(false);
			playSound(msg);
			setPlayerStatus(msg);
			if (!gameState.gameOver && playerState.client !== -1) {
				setWinner(playerState.players[playerState.client].symbol);
			}
			updateGameState({ gameOver: true});
		};

		if (wsclient && gameState.gameId !== "-1") {
			if (skip._skip && gameState.gameId !== "-1" && timerState === 'cross') {
				setPlayerSet(true);
				setSymbolSet(true);
				endGame("unavailable");
			}

			wsclient?.addMessageListener(`player-left-${gameState.gameId}`, gameState.gameId, endGame);

			return () => {
				wsclient?.removeMessageListener(`player-left-${gameState.gameId}`, gameState.gameId);
			}
		}
	}, [gameState.gameId, gameState.gameOver, playerState.client, playerState.players, skip._skip, timerState, wsclient, setPlayerStatus, setRequestRematch, setSendRequest, setWinner, playSound, updateGameState]);

	// Handle rematch request
	useEffect(() => {
		const rematch = (msg: string) => {
			if (msg === "true") {
				setRematchIndex((prevState) => prevState + 1);
				setRequestRematch(true);
				playSound("rematchSend")
			}
		};

		if (wsclient && gameState.gameId !== '-1') {
			wsclient?.addMessageListener(`Request-Rematch-${gameState.gameId}`, gameState.gameId, rematch)

			return () => {
				wsclient?.removeMessageListener(`Request-Rematch-${gameState.gameId}`, gameState.gameId);
			}
		}
	}, [wsclient, gameState.gameId, setRematchIndex, setRequestRematch, playSound]);

	// Handle tournament finish
	useEffect(() => {
		const finish = (msg: string) => {
			setTournament({ id: -1, index: -1});
			wsclient?.leave();
			router.push('/');
		};

		if (wsclient && tournament.id !== -1) {
			wsclient?.addMessageListener('tournament-finished', String(tournament.id), finish)

			return () => {
				wsclient?.removeMessageListener('tournament-finished', String(tournament.id));
			}
		}
	}, [router, tournament.id, wsclient, setTournament]);

	// Send rematch request
	useEffect(() => {
		if (sendRequest) {
			playSound("rematchSend")
			const bot = botState.isActive ? 1 : 0;
			setRematchIndex((prevState) => prevState + 1 + bot);
			wsclient?.emitMessageToGame("true", `Request-Rematch-${gameState.gameId}`, gameState.gameId);
		}
	}, [sendRequest, botState.isActive, gameState.gameId, wsclient, setRematchIndex, playSound]);

	// Handle continue request
	useEffect(() => {
		const continueGame = (msg: string) => {
			if (msg === "true") {
				setContinueIndex((prevState) => prevState + 1);
			}
		};

		if (wsclient && gameState.gameId !== '-1') {
			wsclient?.addMessageListener(`Continue-${gameState.gameId}`, gameState.gameId, continueGame)

			return () => {
				wsclient?.removeMessageListener(`Continue-${gameState.gameId}`, gameState.gameId);
			}
		}
	}, [wsclient, gameState.gameId, setContinueIndex]);

	// Send continue request
	useEffect(() => {
		if (sendContinueRequest) {
			const bot = botState.isActive ? 1 : 0;
			setContinueIndex((prevState) => prevState + 1 + bot)
			wsclient?.emitMessageToGame("true", `Continue-${gameState.gameId}`, gameState.gameId);
		}
	}, [sendContinueRequest, wsclient, gameState.gameId, botState.isActive, setContinueIndex]);

	// Send pause state
	useEffect(() => {
		if (gameState.pause && wsclient) {
			wsclient?.emitMessageToGame("true", `Pause-${gameState.gameId}`, gameState.gameId);
		}
	}, [gameState.pause, wsclient, gameState.gameId]);

	// Pause listener
	useEffect(() => {
		const setPause = (msg: string) => {
			if (msg === "true") {
				updateGameState({ pause: true });
			}
		};

		if (wsclient && gameState.gameId !== "-1") {
			wsclient?.addMessageListener(`Pause-${gameState.gameId}`, gameState.gameId, setPause)

			return () => {
				wsclient?.removeMessageListener(`Pause-${gameState.gameId}`, gameState.gameId);
			} 
		}
	}, [wsclient, gameState.gameId, updateGameState]);

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
			const botClientNumber = isGameMode ? 2 : 1;

			setPlayerState((prevState) => {
				const updatedPlayers = prevState.players.map((player, index) => {
					return { ...player, symbol: symbols[index] };
				});

				return { ...prevState, players: updatedPlayers };
			});

			if (!botState.isActive || isGameMode) {
				wsclient?.emitMessageToGame(JSON.stringify(symbols), `ShuffeledPlayer-${gameState.gameId}`, gameState.gameId);
			}

			if (botState.isActive) {
				setBot(({ ...botState, symbol: symbols[botClientNumber] }));
			}
			setSymbolSet(true);
			updateGameState({ pause: false });
		};

		if (playerSet && playerState.client === 0 && !symbolSet) {
			sendRandomSymbol();
		}
	}, [playerSet, symbolSet, playerState, botState, gameState.gameId, isGameMode, wsclient, setBot, setPlayerState, updateGameState]);

	// Opponents receive newly shuffled symbols
	useEffect(() => {
		const setSymbols = (msg: string) => {
			const newSymbols = JSON.parse(msg);

			setPlayerState((prevState) => {
				const updatedPlayers = prevState.players.map((player, index) => {
					return { ...player, symbol: newSymbols[index] };
				});

				return { ...prevState, players: updatedPlayers };
			});
			updateGameState({ pause: false });
		};

		if (wsclient && gameState.gameId !== "-1") {
			wsclient?.addMessageListener(`ShuffeledPlayer-${gameState.gameId}`, gameState.gameId, setSymbols)
			
			return () => {
				wsclient?.removeMessageListener(`ShuffeledPlayer-${gameState.gameId}`, gameState.gameId);
			}
		}
	}, [wsclient, gameState.gameId, setPlayerState, updateGameState]);

	return (null);
});

TTTSocketEvents.displayName = "TTTSocketEvents"