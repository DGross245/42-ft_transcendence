import { memo, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation"

import { usePongGameState } from "@/app/[lang]/pong/hooks/usePongGameState";
import { usePongSocket } from "@/app/[lang]/pong/hooks/usePongSocket";
import { Timer } from "../Timer";
import GameModal, { GameResult, Status } from "@/app/[lang]/modals/GameModal";
import useContract, { PlayerScore } from "../hooks/useContract";
import { usePongUI } from "@/app/[lang]/pong/hooks/usePongUI";
import { initialPongPlayerState } from "@/app/[lang]/pong/context/PongSockets";
import CustomizeModal from "@/app/[lang]/modals/CutomizeModal";
import { useWeb3ModalAccount } from "@web3modal/ethers5/react";
import { useJoinEvents } from "../hooks/useJoinGame";
import { intToHexColor } from "../TTT/TTTModals";

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

export const PongModals = memo(() => {
	//* ------------------------------- hooks ------------------------------ */
	const {
		pongGameState,
		isGameMode,
		started,
		scores,
		tournament,
		updatePongGameState,
		setStarted,
		winner,
		setTournament
	} = usePongGameState();
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
		wsclient,
		setPlayerState,
		setSendRequest,
		playerAddress,
		customized,
		setCustomized,
		unregistered,
		sendRequest
	} = usePongSocket();
	const {
		submitGameResultRanked,
		submitGameResultTournament,
		getTournament,
		getPlayer
	} = useContract();
	const {
		closeModal,
		showModal
	} = usePongUI();

	const {
		onSetNameAndColor
	} = useJoinEvents(wsclient);
	const router = useRouter();
	const { tmContract } = useContract();
	const {isConnected, address} = useWeb3ModalAccount();

	//* ------------------------------- state variables ------------------------------ */
	const [isClicked, setIsClicked] = useState(false);
	const [playerInfos, setPlayerInfos] = useState({ color: "#ffffff", name: "KEK" });
	const [showSetModal, setShowSetModal] = useState(false);
	const [showCustomModal, setShowCustomModal] = useState(false);

	/* ------------------------------- functions ------------------------------ */
	const handleButtonClick = useCallback(() => {
		if (!sendContinueRequest) {
			setSendContinueRequest(true);
		}
	}, [sendContinueRequest, setSendContinueRequest]);

	// Changes text based on winner
	const getGameResult = useCallback(() => {
		if (showModal) {
			if (winner === String(playerState.players[playerState.client].number + 1) || (winner === '' && playerStatus === "disconnect")) {
				return (GameResult.Winner);
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
		if (playerState.master || playerStatus === "disconnect" || playerStatus === "leave" ) {
			const maxClient = isGameMode ? 4 : 2;
			const playerScore: PlayerScore[] = [];

			for (let i = 0; i < maxClient; i++) {
				playerScore.push({
					addr: playerState.players[i].addr, score: scores.p1Score * 100,
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
			} else if (playerState.master) {
				if (!(await submitGameResultRanked(playerScore))) {
					return ;
				}
			}
			const status = await wsclient?.updateStatus(false, pongGameState.gameId);
			wsclient?.leave();
	
			// reset loop important states
			closeModal();
			updatePongGameState({ gameId: "-1", pause: true, reset: true });
			setPlayerState(initialPongPlayerState());
			setStarted(false);
			setChipDisappear(false);
			setTournament({ ...tournament, index: -1});

			if (status) {
				if (tournament.id !== -1) {
					wsclient?.requestTournament(tournament.id, 'Pong');
				} else {
					wsclient?.joinQueue('Pong');
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
		router.push('/');
		wsclient?.leave();
	}, [wsclient, router]);

	useEffect(() => {
		const getPlayerInfo = async () => {
			if (playerAddress !== "") {
				const playerData = await getPlayer(String(playerAddress));
				if (playerData && Number(playerData.addr) !== 0) {
					const color = intToHexColor(Number(playerData.color));
					setPlayerInfos({ color: color, name: String(playerData.name)});
				}
			}
		}

		if (pongGameState.gameId !== '-1' && !customized) {
			getPlayerInfo();
		}
	}, [customized, pongGameState.gameId, playerAddress, getPlayer, setPlayerInfos]);

	const initiateGame = async (username: string, color: string) => {
		if (username.length < 2 || username.length > 26) {
			return ;
		}

		if (username !== playerInfos.name || color !== playerInfos.color) {
			const colorCopy = color.replace('#', '0x');
			setPlayerInfos({ color: color, name: String(username) });
			if (await onSetNameAndColor(username, colorCopy)) {
				return ;
			}
		}

		setCustomized(true);
	}

	useEffect(() => {
		if (pongGameState.reset) {
			closeModal();
		}
	}, [pongGameState.reset, closeModal])

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
			if (!(await onSetNameAndColor(username, colorCopy))) {
				setShowSetModal(false);
			}
		}
	}

	useEffect(() => {
		let timerId: NodeJS.Timeout;

		if (pongGameState.gameId !== '-1' && !customized && tournament.id !== -1) {
			timerId = setTimeout(() => {
				setShowCustomModal(true);
			}, 3000); 
		}
		else if (pongGameState.gameId !== '-1' && !customized) {
			setShowCustomModal(true);
		} else {
			setShowCustomModal(false);
		}
		return () => {
			if (timerId) {
				clearTimeout(timerId);
				
			}
		};
	}, [pongGameState.gameId, customized, tournament]);

	return (
		<>
			{/* Pause Modal */}
			<GameModal
				isOpen={started && pongGameState.pause && !pongGameState.gameOver && pongGameState.gameId !== '-1'}
				gameResult={GameResult.Paused}
				pauseInfo={{
					onClick: handleButtonClick,
					currentClients: continueIndex,
					maxClients: isGameMode ? 4 : 2
				}}
			/>
			{tournament.id !== -1 ? (
				// Tournament Modal
				<GameModal isOpen={showModal} gameResult={getGameResult()} nextGame={() => handleNextClick()} status={getStatus()} quit={quitGame}/>
				) : (
					pongGameState.gameId.includes("Custom-Game-") ? (
						// Custom-Game Modal
						<GameModal isOpen={showModal} gameResult={getGameResult()} rematch={()=> setSendRequest(true)} status={getStatus()} buttonLoading={sendRequest} quit={quitGame}/>
				) : (
					// Ranked Modal
					<GameModal isOpen={showModal} gameResult={getGameResult()} queue={() => handleNextClick()} status={getStatus()} quit={quitGame}/>
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
				showChip={pongGameState.gameId !== "-1" && !pongGameState.gameId.includes("Custom-Game-")}
				timerState={timerState}
				setTimerState={setTimerState}
				disappear={chipDisappear}
				setDisappear={setChipDisappear}
			/>
		</>
	)
})

PongModals.displayName = "PongModals"