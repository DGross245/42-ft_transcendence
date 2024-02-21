import { useEffect, useState } from "react";

import useWSClient from "@/helpers/wsclient";
import { useSound } from "@/components/hooks/Sound";
import { usePongSocket } from "@/app/pong/hooks/usePongSocket";
import { usePongGameState } from "@/app/pong/hooks/usePongGameState";
import useContract from "@/components/hooks/useContract";

export const PongSocketEvents = () => {
	// Provider hooks
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
		setSendRequest,
		continueIndex,
		setContinueIndex,
		sendContinueRequest,
		isFull,
		setIsFull,
		timerState,
		chipDisappear
	} = usePongSocket();
	const {
		pongGameState,
		updatePongGameState,
		isGameMode,
		setPlayerPaddle,
		bottomPaddleRef,
		leftPaddleRef,
		topPaddleRef,
		rightPaddleRef,
		botState,
		setTournament
	} = usePongGameState();

	// Normal hooks
	const newClient = useWSClient();
	const soundEngine = useSound();
	const {
		getPlayer,
		address
	} = useContract();

	// State variables
	const [skip, setSkip] = useState({ _skip: false, address: "" })

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

	// Wait until a game is found
	useEffect(() => {
		const waiting = async () => {
			if (wsclient && pongGameState.gameId === "-1") {
				setSkip({ _skip: false, address: ""});
				setIsFull("");
				// setPlayerSet(false);
				const { gameID, tournamentId, gameIndex } = await wsclient.waitingRoom();
				if (tournamentId === -1 && !gameID.includes("Costome-Game-") && !isGameMode) {
					wsclient.joinQueue("Pong");
				} else {
					setTournament({ id: tournamentId, index: gameIndex })
				}
				updatePongGameState({ ...pongGameState, gameId: gameID });
			}
		}

		waiting();
	}, [wsclient, pongGameState.gameId]);

	const chooseRef = (clients: number) => {
		if (clients === 0)
			setPlayerPaddle({ ref: bottomPaddleRef, pos: bottomPaddleRef.current.position.x, maxPos: 111 - 15, minPos: -111 + 15});
		else if (clients === 1)
			setPlayerPaddle({ ref: leftPaddleRef, pos: leftPaddleRef.current.position.z, maxPos: 111 - 15, minPos: -111 + 15});
		else if (clients === 2)
			setPlayerPaddle({ ref: topPaddleRef, pos: topPaddleRef.current.position.x, maxPos: 111 - 15, minPos: -111 + 15});
		else if (clients === 3)
			setPlayerPaddle({ ref: rightPaddleRef, pos: rightPaddleRef.current.position.z, maxPos: 111 - 15, minPos: -111 + 15});
	}

	useEffect(() => {
		const joinTheGame = async () => {
			if (wsclient && pongGameState.gameId !== "-1") {
				const player = await getPlayer(String(address))
				const clients = await wsclient.joinGame(pongGameState.gameId, isGameMode ? "OneForAll" : "Pong", botState.isActive);
				let newPlayerData = { ...playerState };

				newPlayerData.players[clients] = {
						name: player.name,
						addr: String(address),
						color: Number(player.color),
						number: clients
				},
				newPlayerData.master = clients === 0 ? true : false,
				newPlayerData.client = clients

				// Handle the tournament case where a player subscribed to a tournament is not present
				if (skip._skip) {
					newPlayerData.players[1] = {
						name: "Unknown",
						addr: skip.address,
						color: 0xffffff,
						number: 1,
					}
					// setPlayerSet(true);
				}

				setPlayerState( newPlayerData );
				if (isGameMode)
					chooseRef(clients);
			}
		};

		joinTheGame();
	}, [wsclient, pongGameState.gameId]);

	useEffect(() => {
		const sendPlayerData = () => {
			const playerData = {
				name: playerState.players[playerState.client].name,
				addr: playerState.players[playerState.client].addr,
				color: playerState.players[playerState.client].color,
				number: playerState.players[playerState.client].number,
			}
			wsclient?.emitMessageToGame(JSON.stringify(playerData), `PlayerData-${pongGameState.gameId}`, pongGameState.gameId);
		};
		
		if (playerState.client !== -1 && isFull === "FULL") {
			sendPlayerData();
			updatePongGameState({ ...pongGameState, pause: false });
		}
	}, [playerState.client, isFull]);

	useEffect(() => {
		const setPaddlePos = (msg: string) => {
			const paddleData = JSON.parse(msg);

			if (paddleData.client === 0)
				bottomPaddleRef.current.position.x = paddleData.pos;
			else if (paddleData.client === 1)
				leftPaddleRef.current.position.z = paddleData.pos;
			else if (paddleData.client === 2)
				topPaddleRef.current.position.x = paddleData.pos;
			else if (paddleData.client === 3)
				rightPaddleRef.current.position.z = paddleData.pos;
		};

		if (wsclient && isGameMode) {
			wsclient?.addMessageListener(`Paddle-${pongGameState.gameId}`, pongGameState.gameId, setPaddlePos);

			return () => {
				wsclient?.removeMessageListener(`Paddle-${pongGameState.gameId}`, pongGameState.gameId);
			} 
		}
	},[wsclient, pongGameState.gameId, playerState]);

	useEffect(() => {
		const setPlayer = (msg: string) => {
			const playerData = JSON.parse(msg);
			let newPlayerData = { ...playerState };
			const player = playerState.players.find(player => player.number === playerData.number);

			if (!player) {
				newPlayerData.players[playerData.number] = {
					name: playerData.name,
					addr: playerData.addr,
					color: playerData.color,
					number: playerData.number,
				}
				setPlayerState( newPlayerData );
			}
		};

		if (wsclient && pongGameState.gameId !== "-1") {
			wsclient?.addMessageListener(`PlayerData-${pongGameState.gameId}`, pongGameState.gameId, setPlayer);

			return () => {
				wsclient?.removeMessageListener(`PlayerData-${pongGameState.gameId}`, pongGameState.gameId);
			} 
		}
	},[wsclient, pongGameState.gameId, playerState]);

	useEffect(() => {
		const setPause = (msg: string) => {
			if (msg === "FULL")
				setIsFull(msg);
		};

		if (wsclient && pongGameState.gameId !== "-1") {
			wsclient?.addMessageListener(`Players-${pongGameState.gameId}`, pongGameState.gameId, setPause)

			return () => {
				wsclient?.removeMessageListener(`Players-${pongGameState.gameId}`, pongGameState.gameId);
			} 
		}
	}, [wsclient, pongGameState.gameId]);

	useEffect(() => {
		const endGame = (msg: string) => {
			setRequestRematch(false);
			setSendRequest(false);
			soundEngine?.playSound("door");
			
			if (!disconnected)
				setDisconnected(true);
			if (!pongGameState.gameOver) {
				console.log("EXECUTE GAMEOVER TRUE")
				updatePongGameState({ ...pongGameState, gameOver: true });
			}
		};

		if (wsclient && pongGameState.gameId !== '-1') {
			if (skip._skip && pongGameState.gameId !== "-1" && timerState === 'cross')
				endGame("SKIP");

			wsclient?.addMessageListener(`player-disconnected-${pongGameState.gameId}`, pongGameState.gameId, endGame)

			return () => {
				wsclient?.removeMessageListener(`player-disconnected-${pongGameState.gameId}`, pongGameState.gameId);
			}
		}
	}, [wsclient, disconnected, pongGameState.gameOver, pongGameState.gameId, timerState]);

	// Handle rematch request
	useEffect(() => {
		const rematch = (msg: string) => {
			if (msg === "true") {
				setRematchIndex(rematchIndex + 1);
				setRequestRematch(true);
			}
		};

		if (wsclient && pongGameState.gameId !== '-1') {
			wsclient?.addMessageListener(`Request-Rematch-${pongGameState.gameId}`, pongGameState.gameId, rematch)

			return () => {
				wsclient?.removeMessageListener(`Request-Rematch-${pongGameState.gameId}`, pongGameState.gameId);
			}
		}
	}, [wsclient, rematchIndex, pongGameState.gameId]);

	// Send rematch request
	useEffect(() => {
		if (sendRequest) {
			const bot = botState.isActive ? 1 : 0;
			setRematchIndex(rematchIndex + 1 + bot);
			wsclient?.emitMessageToGame("true", `Request-Rematch-${pongGameState.gameId}`, pongGameState.gameId);
		}
	}, [sendRequest]);

	// Handle continue request
	useEffect(() => {
		const continueGame = (msg: string) => {
			if (msg === "true") {
				setContinueIndex(continueIndex + 1);
			}
		};

		if (wsclient && pongGameState.gameId !== '-1') {
			wsclient?.addMessageListener(`Continue-${pongGameState.gameId}`, pongGameState.gameId, continueGame)

			return () => {
				wsclient?.removeMessageListener(`Continue-${pongGameState.gameId}`, pongGameState.gameId);
			}
		}
	}, [wsclient, continueIndex, pongGameState.gameId]);

	// Send continue request
	useEffect(() => {
		if (sendContinueRequest) {
			const bot = botState.isActive ? 1 : 0;
			setContinueIndex(continueIndex + 1 + bot)
			wsclient?.emitMessageToGame("true", `Continue-${pongGameState.gameId}`, pongGameState.gameId);
		}
	}, [sendContinueRequest,  wsclient, pongGameState.gameId]);

	// Send pause state
	useEffect(() => {
		if (pongGameState.pause && wsclient) {
			wsclient?.emitMessageToGame("true", `Pause-${pongGameState.gameId}`, pongGameState.gameId);
		}
	}, [pongGameState.pause]);

	useEffect(() => {
		const setPause = (msg: string) => {
			if (msg === "true")
				updatePongGameState({ ...pongGameState, pause: true });
	};
	
		if (wsclient && pongGameState.gameId !== "-1") {
			wsclient?.addMessageListener(`Pause-${pongGameState.gameId}`, pongGameState.gameId, setPause)

			return () => {
				wsclient?.removeMessageListener(`Pause-${pongGameState.gameId}`, pongGameState.gameId);
			} 
		}
	}, [wsclient, pongGameState.gameId]);

	return (null);
}