import { useGameState } from "@/app/[lang]/tic-tac-toe/hooks/useGameState";
import EndModal from "./EndModal";
import { PauseModal } from "../PauseModal";
import { useSocket } from "@/app/[lang]/tic-tac-toe/hooks/useSocket";
import { Timer } from "../Timer";
import { memo, useCallback, useEffect, useState } from "react";
import GameModal, { GameResult, Status } from "@/app/[lang]/modals/GameModal";
import { useUI } from "@/app/[lang]/tic-tac-toe/hooks/useUI";
import { initialTTTPlayerState } from "@/app/[lang]/tic-tac-toe/context/TTTSockets";
import useContract, { PlayerScore } from "../hooks/useContract";

export const TTTModals = memo(() => {
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
	// Normal hooks
	const {
		showModal,
		closeModal,
		openModal
	} = useUI();
	const [isClicked, setIsClicked] = useState(false);
	const handleButtonClick = useCallback(() => {
		if (!sendContinueRequest)
			setSendContinueRequest(true);
	}, [setSendContinueRequest, sendContinueRequest]);

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
				const finished = (await data).games[tournament.index].finished
				if (!finished)
					await submitGameResultTournament(tournament.id, tournament.index, playerScore);
			} else if (playerState.client === 0) {
				await submitGameResultRanked(playerScore);
			}
		}
		const status = await wsclient?.updateStatus(false, gameState.gameId);
		wsclient?.leave();
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

	const getStatus = useCallback(() => {
		if (playerStatus === "disconnect") {
			return (Status.Disconnected);
		} else if (playerStatus === "leave") {
			return (Status.Left);
		} else if (playerStatus === "unavailable") {
			return (Status.Unavailable);
		}
	}, [playerStatus]);

	return (
		<>
			<section className="flex gap-5 items-center justify-center h-full p-5 flex-wrap md:flex-nowrap">
				<GameModal
					isOpen={started && gameState.pause && !gameState.gameOver && gameState.gameId !== '-1'}
					gameResult={GameResult.Paused}
					pauseInfo={{
						onClick: handleButtonClick,
						currentClients: continueIndex,
						maxClients: isGameMode ? 3 : 2
					}}
				/>
				{/* Custom-Game Modal */}
				<GameModal isOpen={showModal} gameResult={getGameResult()} rematch={()=> setSendRequest(true)} loading={sendRequest} status={getStatus()} quit={() => <></>}/>
				{/* Tournament Modal */}
				<GameModal isOpen={showModal} gameResult={getGameResult()} nextGame={() => handleNextClick()} status={getStatus()} quit={() => <></>}/>
				{/* Ranked Modal */}
				<GameModal isOpen={showModal} gameResult={getGameResult()} queue={() => handleNextClick()} status={getStatus()} quit={() => <></>}/>

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
		</>
	)
})

TTTModals.displayName = "TTTModals"