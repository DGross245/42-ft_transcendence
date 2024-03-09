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
import { useJoinEvents } from "../JoinGame";
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
		winner
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
			if (winner === String(playerState.players[0].number + 1) || (winner === '' && playerStatus === "disconnect")) {
				return (GameResult.Winner);
			} else {
				return (GameResult.Loser);
			}
		}
	}, [showModal, playerState, winner, playerStatus])

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
				const lol = getTournament(tournament.id);
				const finished = (await lol).games[tournament.index].finished;
				if (!finished) {
					await submitGameResultTournament(tournament.id, tournament.index, playerScore);
				}
			} else if (playerState.master) {
				await submitGameResultRanked(playerScore);
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

		if (status) {
			if (tournament.id !== -1) {
				wsclient?.requestTournament(tournament.id, 'Pong');
			} else {
				wsclient?.joinQueue('Pong');
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

	// Click handler for preventing clicking a button multiple times
	const handleNextClick = async () => {
		if (!isClicked) {
			setIsClicked(true);
			await sendScoreAndContinue();
			setIsClicked(false);
		}
	};

	// Quit handler
	const quitGame = useCallback(() => {
		router.push('/');
		wsclient?.leave();
	}, [wsclient, router]);

	useEffect(() => {
		const getPlayerInfo = async () => {
			if (playerAddress !== "") {
				const playerInfo = await getPlayer(String(playerAddress));

				const color = intToHexColor(Number(playerInfo.color));
				setPlayerInfos({ color: color, name: String(playerInfo.name)});
			}
		}

		if (pongGameState.gameId !== '-1' && !customized) {
			getPlayerInfo();
		}
	}, [customized, pongGameState.gameId, playerAddress, getPlayer, setPlayerInfos]);

	const initiateGame = async (username: string, color: string) => {
		if (username !== playerInfos.name || color !== playerInfos.color) {
			const colorCopy = color.replace('#', '0x');
			const number = await onSetNameAndColor(username, colorCopy);
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
		const number = await onSetNameAndColor(username, colorCopy);
		if (number) {
			setShowSetModal(false);
		}
	}

	useEffect(() => {
		let timerId: NodeJS.Timeout;

		if (pongGameState.gameId !== '-1' && !customized && tournament.id !== -1) {
			timerId = setTimeout(() => {
				setShowCustomModal(true);
			}, 3000); 
		}
		else {
			setShowCustomModal(false);
		}
		return () => {
			clearTimeout(timerId);
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
					maxClients: isGameMode ? 3 : 2
				}}
			/>
			{tournament.id !== -1 ? (
				// Tournament Modal
				<GameModal isOpen={showModal} gameResult={getGameResult()} nextGame={() => handleNextClick()} status={getStatus()} quit={quitGame}/>
				) : (
					pongGameState.gameId.includes("Custom-Game-") ? (
						// Custom-Game Modal
						<GameModal isOpen={showModal} gameResult={getGameResult()} rematch={()=> setSendRequest(true)} loading={sendRequest} status={getStatus()} quit={quitGame}/>
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

PongModals.displayName = "TTTModals"