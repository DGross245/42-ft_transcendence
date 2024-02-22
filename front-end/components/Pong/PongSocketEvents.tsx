import { useCallback, useEffect, useRef, useState } from "react";

import useWSClient from "@/helpers/wsclient";
import { useSound } from "@/components/hooks/Sound";
import { usePongSocket } from "@/app/pong/hooks/usePongSocket";
import { usePongGameState } from "@/app/pong/hooks/usePongGameState";
import useContract from "@/components/hooks/useContract";

export const usePrevious = (value, initialValue) => {
	const ref = useRef(initialValue);
	useEffect(() => {
	  ref.current = value;
	});
	return ref.current;
  };

  export const useEffectDebugger = (effectHook, dependencies, dependencyNames = []) => {
	const previousDeps = usePrevious(dependencies, []);
  
	const changedDeps = dependencies.reduce((accum, dependency, index) => {
	  if (dependency !== previousDeps[index]) {
		const keyName = dependencyNames[index] || index;
		return {
		  ...accum,
		  [keyName]: {
			before: previousDeps[index],
			after: dependency
		  }
		};
	  }
  
	  return accum;
	}, {});
  
	if (Object.keys(changedDeps).length) {
	  console.log('[use-effect-debugger] ', changedDeps);
	}
  
	useEffect(effectHook, dependencies);
};


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
	}, [newClient, setWsclient, address]);

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
				updatePongGameState({ gameId: gameID });
			}
		}

		waiting();
	}, [wsclient, pongGameState.gameId, isGameMode, setIsFull, setTournament, updatePongGameState]);

	useEffect(() => {
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

		const joinTheGame = async () => {
			if (wsclient && pongGameState.gameId !== "-1") {
				const player = await getPlayer(String(address));
				const clients = await wsclient.joinGame(pongGameState.gameId, isGameMode ? "OneForAll" : "Pong", botState.isActive);

				setPlayerState((prevState) => {
					const updatedPlayers = prevState.players.map((prevPlayer, index) => {
						if (index === clients) {
							return {
								name: player.name,
								addr: String(address),
								color: Number(player.color),
								number: clients
							};
						} else {
							return ( prevPlayer );
						}
					});

					const newState = {
						...prevState,
						players: updatedPlayers,
						master: clients === 0 ? true : false,
						client: clients
					};

					// Handle the tournament case where a player subscribed to a tournament is not present
					if (skip._skip && clients === 1) {
						newState.players[1] = {
							name: "Unknown",
							addr: skip.address,
							color: 0xffffff,
							number: 1,
						};
					}

					return ( newState );
				});

				if (isGameMode) {
					chooseRef(clients);
				}

			}
		};

		joinTheGame();
	}, [wsclient, pongGameState.gameId, address, botState.isActive, getPlayer, setPlayerState, isGameMode, skip, setPlayerPaddle, bottomPaddleRef, leftPaddleRef, rightPaddleRef, topPaddleRef]);

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
			updatePongGameState({ pause: false });
		}
	}, [playerState.client, isFull, playerState.players, pongGameState.gameId, updatePongGameState, wsclient]);

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
	},[wsclient, pongGameState.gameId, playerState, bottomPaddleRef, leftPaddleRef, rightPaddleRef, topPaddleRef, isGameMode]);

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
							};
						} else {
							return ( prevPlayer );
						}
					});

					return { ...prevState, players: updatedPlayers };
				});
			}
		};

		if (wsclient && pongGameState.gameId !== "-1") {
			wsclient?.addMessageListener(`PlayerData-${pongGameState.gameId}`, pongGameState.gameId, setPlayer);

			return () => {
				wsclient?.removeMessageListener(`PlayerData-${pongGameState.gameId}`, pongGameState.gameId);
			} 
		}
	},[wsclient, pongGameState.gameId, playerState.players, setPlayerState]);

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
	}, [wsclient, pongGameState.gameId, setIsFull]);

	useEffect(() => {
		const endGame = (msg: string) => {
			setRequestRematch(false);
			setSendRequest(false);
			soundEngine?.playSound("door");
			setDisconnected(true);
			updatePongGameState({ gameOver: true });
		};

		if (wsclient && pongGameState.gameId !== '-1') {
			if (skip._skip && pongGameState.gameId !== "-1" && timerState === 'cross')
				endGame("SKIP");

			wsclient?.addMessageListener(`player-disconnected-${pongGameState.gameId}`, pongGameState.gameId, endGame)

			return () => {
				wsclient?.removeMessageListener(`player-disconnected-${pongGameState.gameId}`, pongGameState.gameId);
			}
		}
	}, [wsclient, pongGameState.gameId, timerState, setDisconnected, setRequestRematch, setSendRequest, skip._skip, soundEngine, updatePongGameState]);

	// Handle rematch request
	useEffect(() => {
		const rematch = (msg: string) => {
			if (msg === "true") {
				setRematchIndex((prevState) => (prevState + 1));
				setRequestRematch(true);
			}
		};

		if (wsclient && pongGameState.gameId !== '-1') {
			wsclient?.addMessageListener(`Request-Rematch-${pongGameState.gameId}`, pongGameState.gameId, rematch)

			return () => {
				wsclient?.removeMessageListener(`Request-Rematch-${pongGameState.gameId}`, pongGameState.gameId);
			}
		}
	}, [wsclient, pongGameState.gameId, setRematchIndex, setRequestRematch]);

	// Send rematch request
	useEffect(() => {
		if (sendRequest) {
			const bot = botState.isActive ? 1 : 0;
			setRematchIndex((prevState) => (prevState + 1 + bot));
			wsclient?.emitMessageToGame("true", `Request-Rematch-${pongGameState.gameId}`, pongGameState.gameId);
		}
	}, [sendRequest, botState.isActive, setRematchIndex, pongGameState.gameId, wsclient]);

	// Handle continue request
	useEffect(() => {
		const continueGame = (msg: string) => {
			if (msg === "true") {
				setContinueIndex((prevState) => (prevState + 1));
			}
		};

		if (wsclient && pongGameState.gameId !== '-1') {
			wsclient?.addMessageListener(`Continue-${pongGameState.gameId}`, pongGameState.gameId, continueGame)

			return () => {
				wsclient?.removeMessageListener(`Continue-${pongGameState.gameId}`, pongGameState.gameId);
			}
		}
	}, [wsclient, pongGameState.gameId, setContinueIndex]);

	// Send continue request
	useEffect(() => {
		if (sendContinueRequest) {
			const bot = botState.isActive ? 1 : 0;
			setContinueIndex((prevState) => (prevState + 1 + bot))
			wsclient?.emitMessageToGame("true", `Continue-${pongGameState.gameId}`, pongGameState.gameId);
		}
	}, [sendContinueRequest,  wsclient, pongGameState.gameId, botState.isActive, setContinueIndex]);

	// Send pause state
	useEffect(() => {
		if (pongGameState.pause && wsclient) {
			wsclient?.emitMessageToGame("true", `Pause-${pongGameState.gameId}`, pongGameState.gameId);
		}
	}, [pongGameState.pause, wsclient, pongGameState.gameId]);

	useEffect(() => {
		const setPause = (msg: string) => {
			if (msg === "true") {
				updatePongGameState({ pause: true });
			}
		};

		if (wsclient && pongGameState.gameId !== "-1") {
			wsclient?.addMessageListener(`Pause-${pongGameState.gameId}`, pongGameState.gameId, setPause)

			return () => {
				wsclient?.removeMessageListener(`Pause-${pongGameState.gameId}`, pongGameState.gameId);
			} 
		}
	}, [wsclient, pongGameState.gameId, updatePongGameState]);

	return (null);
}