import { memo, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation"

import { useGameState } from "@/app/[lang]/tic-tac-toe/hooks/useGameState";
import { useSocket } from "@/app/[lang]/tic-tac-toe/hooks/useSocket";
import { Timer } from "../Timer";
import GameModal, { GameResult, Status } from "@/app/[lang]/modals/GameModal";
import { useUI } from "@/app/[lang]/tic-tac-toe/hooks/useUI";
import { initialTTTPlayerState } from "@/app/[lang]/tic-tac-toe/context/TTTSockets";
import useContract, { PlayerScore } from "../hooks/useContract";
import CustomizeModal from "@/app/[lang]/modals/CutomizeModal";
import { useJoinEvents } from "../hooks/useJoinGame";
import { useWeb3ModalAccount } from "@web3modal/ethers5/react";
import useOnUnUnmount from "../hooks/onUnmount";
import guestContext from "@/app/[lang]/guestProvider";

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

export function intToHexColor(intValue: number) {
	return ('#' + intValue.toString(16).padStart(6, '0').toUpperCase());
}

export const TTTModals = memo(() => {
	//* ------------------------------- hooks ------------------------------ */
	const {
		gameState,
		isGameMode,
		started,
		winner,
		updateGameState,
		setStarted,
		tournament,
		setTournament
	} = useGameState();
	const {
		continueIndex,
		setSendContinueRequest,
		sendContinueRequest,
		playerState,
		isFull,
		timerState,
		setTimerState,
		setChipDisappear,
		chipDisappear,
		playerStatus,
		setSendRequest,
		wsclient,
		setPlayerState,
		playerAddress,
		customized,
		setCustomized,
		unregistered,
		sendRequest
	} = useSocket();
	const {
		submitGameResultRanked,
		submitGameResultTournament,
		getTournament,
		getPlayer
	} = useContract();
	const {
		showModal,
		closeModal,
	} = useUI();

	const {
		onSetNameAndColor
	} = useJoinEvents(wsclient);
	const router = useRouter();
	const { tmContract } = useContract();
	const {isConnected, address} = useWeb3ModalAccount();

	useOnUnUnmount(() => {
		if (wsclient) {
			wsclient.disconnect();
		}
	});

	//* ------------------------------- state variables ------------------------------ */
	const [isClicked, setIsClicked] = useState(false);
	const [playerInfos, setPlayerInfos] = useState({ color: "#ffffff", name: "Guest" });
	const [showSetModal, setShowSetModal] = useState(false);
	const [showCustomModal, setShowCustomModal] = useState(false);
	const { isGuest } = useContext(guestContext);

	/* ------------------------------- functions ------------------------------ */
	const handleButtonClick = useCallback(() => {
		if (!sendContinueRequest) {
			setSendContinueRequest(true);
		}
	}, [sendContinueRequest, setSendContinueRequest]);

	// Changes text based on winner
	const getGameResult = useCallback(() => {
		if (showModal) {
			if ((winner === playerState.players[playerState.client].symbol) || (winner === '' && playerStatus === "disconnect")) {
				return (GameResult.Winner);
			} else if (winner === "draw") {
				return (GameResult.Draw);
			} else {
				return (GameResult.Loser);
			}
		}
	}, [showModal, playerState, winner, playerStatus])

	// Click handler for preventing clicking a button multiple times
	const handleNextClick = async () => {
		if (!isClicked) {
			setIsClicked(true);
			await sendScoreAndContinue();
			setIsClicked(false);
		}
	};

	// Function to handle sending player scores and continuing the game
	const sendScoreAndContinue = async () => {
		if (playerState.client === 0 || playerStatus === "disconnect" || playerStatus === "leave" ) {
			const maxClient = isGameMode ? 3 : 2;
			const playerScore: PlayerScore[] = [];

			for (let i = 0; i < maxClient; i++) {
				playerScore.push({
					addr: playerState.players[i].addr, score: winner !== playerState.players[i].symbol ? 0 : 1000,
				})
			}
			if (tournament.id !== -1) {
				const data = await getTournament(tournament.id);
				const finished = data.games[tournament.index].finished;
				if (!finished) {
					if (!(await submitGameResultTournament(tournament.id, tournament.index, playerScore))) {
						return ;
					}
				}
			} else if (playerState.client === 0) {
				if (!(await submitGameResultRanked(playerScore))) {
					return ;
				}
			}
			const status = await wsclient?.updateStatus(false, gameState.gameId);
			wsclient?.leave();

			// reset loop important states
			closeModal();
			updateGameState({ gameId: "-1", pause: true, reset: true });
			setPlayerState(initialTTTPlayerState());
			setStarted(false);
			setChipDisappear(false);
			setTournament({ ...tournament, index: -1});

			if (status) {
				if (tournament.id !== -1) {
					wsclient?.requestTournament(tournament.id, 'TTT');
				} else {
					wsclient?.joinQueue('TTT');
				}
			}
		}
	}

	// Returns Status enum based on playerStatus
	const getStatus = useCallback(() => {
		if (playerStatus === "disconnect") {
			return (Status.Disconnected);
		} else if (playerStatus === "leave") {
			return (Status.Left);
		} else if (playerStatus === "unavailable") {
			return (Status.Unavailable);
		}
	}, [playerStatus]);

	// Quit handler
	const quitGame = useCallback(() => {
		wsclient?.leave();
		router.push('/');
	}, [wsclient, router]);

	useEffect(() => {
		const getPlayerInfo = async () => {
			if (address) {
				const playerData = await getPlayer(String(address));
				if (playerData && Number(playerData.addr) !== 0) {
					const color = intToHexColor(Number(playerData.color));
					setPlayerInfos({ color: color, name: playerData.name});
				}
			}
		}

		if (!customized && !isGuest) {
			getPlayerInfo();
		}
	}, [customized, gameState.gameId, address, isGuest, getPlayer, setPlayerInfos]);

	const initiateGame = async (username: string, color: string) => {
		if (!isGuest) {
			if (username.length < 2 || username.length > 26) {
				return ;
			}
	
			if (username !== playerInfos.name || color !== playerInfos.color) {
				const colorCopy = color.replace('#', '0x');
				if (await onSetNameAndColor(username, colorCopy)) {
					return ;
				}
				setPlayerInfos({ color: color, name: String(username) });
			}
		}

		setCustomized(true);
	}

	useEffect(() => {
		if (gameState.reset) {
			closeModal();
		}
	}, [gameState.reset, closeModal])

	// first registartion
	useEffect(() => {
		const checkPlayerInfo = async () => {
			const playerInfo = await getPlayer(String(address));
			if (Number(playerInfo.addr) === 0) {
				setShowSetModal(true);
			}
		}

		if (isConnected && tmContract && address) {
			checkPlayerInfo();
		}
	}, [isConnected, getPlayer, address, tmContract]);

	const registerNewPlayer = async (username: string, color: string) => {
		const colorCopy = color.replace('#', '0x');
		if (username.length > 1 && username.length < 27) {
			if (isGuest) {
				setPlayerInfos({ color: colorCopy, name: username });
				setShowSetModal(false);
			} else if (!(await onSetNameAndColor(username, colorCopy))) {
				setPlayerInfos({ color: colorCopy, name: username });
				setShowSetModal(false);
			}
		}
	}

	useEffect(() => {
		let timerId: NodeJS.Timeout;

		if (gameState.gameId !== '-1' && !customized && tournament.id !== -1) {
			timerId = setTimeout(() => {
				setShowCustomModal(true);
			}, 3000); 
		}
		else if (gameState.gameId !== '-1' && !customized) {
			setShowCustomModal(true);
		} else {
			setShowCustomModal(false);
		}
		return () => {
			if (timerId) {
				clearTimeout(timerId);
				
			}
		};
	}, [gameState.gameId, customized, tournament]);

	return (
		<>
			{/* Pause Modal */}
			<GameModal
				isOpen={started && gameState.pause && !gameState.gameOver && gameState.gameId !== '-1'}
				gameResult={GameResult.Paused}
				pauseInfo={{
					onClick: handleButtonClick,
					currentClients: continueIndex,
					maxClients: isGameMode ? 3 : 2
				}}
			/>
			{tournament.id !== -1 ? (
				// Tournament Modal
				<GameModal isOpen={showModal} disableButton={playerState.client !== 0 && !(playerStatus === "disconnect" || playerStatus === "leave")} gameResult={getGameResult()} nextGame={() => handleNextClick()} status={getStatus()} quit={quitGame}/>
				) : (
					gameState.gameId.includes("Custom-Game-") ? (
						// Custom-Game Modal
						<GameModal isOpen={showModal} gameResult={getGameResult()} rematch={()=> setSendRequest(true)} status={getStatus()} buttonLoading={sendRequest} quit={quitGame}/>
				) : (
					// Ranked Modal
					<GameModal isOpen={showModal} disableButton={playerState.client !== 0 && !(playerStatus === "disconnect" || playerStatus === "leave")} gameResult={getGameResult()} queue={() => handleNextClick()} status={getStatus()} quit={quitGame}/>
				)
			)}

			{!customized && (
				<CustomizeModal isOpen={showCustomModal} color={playerInfos.color} username={playerInfos.name} startGame={initiateGame}/>
			)}
			{unregistered && (
				<CustomizeModal isOpen={showSetModal} startGame={registerNewPlayer} />
			)}
			<Timer
				playerClient={playerState.client}
				isFull={isFull}
				started={started}
				showChip={gameState.gameId !== "-1" && !gameState.gameId.includes("Custom-Game-")}
				timerState={timerState}
				setTimerState={setTimerState}
				disappear={chipDisappear}
				setDisappear={setChipDisappear}
			/>
		</>
	)
})

TTTModals.displayName = "TTTModals"