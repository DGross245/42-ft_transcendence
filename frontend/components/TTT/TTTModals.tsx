import { memo, useCallback, useState } from "react";
import { useRouter } from "next/navigation"

import { useGameState } from "@/app/[lang]/tic-tac-toe/hooks/useGameState";
import { useSocket } from "@/app/[lang]/tic-tac-toe/hooks/useSocket";
import { Timer } from "../Timer";
import GameModal, { GameResult, Status } from "@/app/[lang]/modals/GameModal";
import { useUI } from "@/app/[lang]/tic-tac-toe/hooks/useUI";
import { initialTTTPlayerState } from "@/app/[lang]/tic-tac-toe/context/TTTSockets";
import useContract, { PlayerScore } from "../hooks/useContract";

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

export const TTTModals = memo(() => {
	//* ------------------------------- hooks ------------------------------ */
	const {
		gameState,
		isGameMode,
		started,
		winner,
		updateGameState,
		setStarted,
		tournament
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
		sendRequest
	} = useSocket();
	const {
		submitGameResultRanked,
		submitGameResultTournament,
		getTournament
	} = useContract();
	const {
		showModal,
		closeModal,
	} = useUI();

	//* ------------------------------- state variables ------------------------------ */
	const [isClicked, setIsClicked] = useState(false);
	const router = useRouter();

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
				return (GameResult.Looser);
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
				const data = getTournament(tournament.id);
				const finished = (await data).games[tournament.index].finished;
				if (!finished) {
					await submitGameResultTournament(tournament.id, tournament.index, playerScore);
				}
			} else if (playerState.client === 0) {
				await submitGameResultRanked(playerScore);
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

		if (status) {
			if (tournament.id !== -1) {
				wsclient?.requestTournament(tournament.id, 'TTT');
			} else {
				console.log("test")
				wsclient?.joinQueue('TTT');
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
	}, [wsclient]);

	return (
		<section className="flex gap-5 items-center justify-center h-full p-5 flex-wrap md:flex-nowrap">
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
				<GameModal isOpen={showModal} gameResult={getGameResult()} rematch={()=> setSendRequest(true)} loading={sendRequest} status={getStatus()} quit={quitGame}/>
			) : (
				gameState.gameId.includes("Costome-Game-") ? (
					// Custom-Game Modal
					<GameModal isOpen={showModal} gameResult={getGameResult()} nextGame={() => handleNextClick()} status={getStatus()} quit={quitGame}/>
				) : (
					// Ranked Modal
					<GameModal isOpen={showModal} gameResult={getGameResult()} queue={() => handleNextClick()} status={getStatus()} quit={quitGame}/>
				)
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
		</section>
	)
})

TTTModals.displayName = "TTTModals"