import { memo, useCallback, useState } from "react";
import { useRouter } from "next/navigation"

import { usePongGameState } from "@/app/[lang]/pong/hooks/usePongGameState";
import { usePongSocket } from "@/app/[lang]/pong/hooks/usePongSocket";
import { Timer } from "../Timer";
import GameModal, { GameResult, Status } from "@/app/[lang]/modals/GameModal";
import useContract, { PlayerScore } from "../hooks/useContract";
import { usePongUI } from "@/app/[lang]/pong/hooks/usePongUI";
import { initialPongPlayerState } from "@/app/[lang]/pong/context/PongSockets";

// TODO: Check if PongUI or UI in TTT is needed or can be simplified

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
		sendRequest
	} = usePongSocket();
	const {
		submitGameResultRanked,
		submitGameResultTournament,
		getTournament
	} = useContract();
	const {
		closeModal,
		showModal
	} = usePongUI();
	const router = useRouter();

	//* ------------------------------- state variables ------------------------------ */
	const [isClicked, setIsClicked] = useState(false);

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
				return (GameResult.Looser);
			}
		}
	}, [showModal, playerState, winner, playerStatus])

	// Function to handle sending player scores and continuing the game
	const sendScoreAndContinue = async () => {
		if (playerState.client === 0 || playerStatus === "disconnect" || playerStatus === "leave" ) {
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
			} else if (playerState.client === 0) {
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

	return (
		<section className="flex gap-5 items-center justify-center h-full p-5 flex-wrap md:flex-nowrap">
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
				<GameModal isOpen={showModal} gameResult={getGameResult()} rematch={()=> setSendRequest(true)} loading={sendRequest} status={getStatus()} quit={quitGame}/>
			) : (
				pongGameState.gameId.includes("Costome-Game-") ? (
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
				showChip={pongGameState.gameId !== "-1" && !pongGameState.gameId.includes("Custom-Game-")}
				timerState={timerState}
				setTimerState={setTimerState}
				disappear={chipDisappear}
				setDisappear={setChipDisappear}
			/>
		</section>
	)
})

PongModals.displayName = "TTTModals"