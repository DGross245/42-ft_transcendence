import { useGameState } from "@/app/[lang]/tic-tac-toe/hooks/useGameState";
import EndModal from "./EndModal";
import { PauseModal } from "../PauseModal";
import { useSocket } from "@/app/[lang]/tic-tac-toe/hooks/useSocket";
import { Timer } from "../Timer";
import { memo, useCallback } from "react";
import GameModal, { GameResult } from "@/app/[lang]/modals/GameModal";

export const TTTModals = memo(() => {
	const {
		gameState,
		isGameMode,
		started
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
		chipDisappear
	} = useSocket();

	const handleButtonClick = useCallback(() => {
		if (!sendContinueRequest)
			setSendContinueRequest(true);
	}, [setSendContinueRequest, sendContinueRequest]);

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
				<EndModal />
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