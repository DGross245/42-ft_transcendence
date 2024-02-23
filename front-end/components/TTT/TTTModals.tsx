import { useGameState } from "@/app/tic-tac-toe/hooks/useGameState";
import EndModal from "./EndModal";
import { PauseModal } from "../PauseModal";
import { useSocket } from "@/app/tic-tac-toe/hooks/useSocket";
import { Timer } from "../Timer";
import { memo, useCallback } from "react";

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
			<PauseModal
				gameState={gameState}
				continueIndex={continueIndex}
				handleButtonClick={handleButtonClick}
				maxClient={isGameMode ? 3 : 2}
				started={started}
			/>
			<EndModal />
			<Timer
				playerClient={playerState.client}
				isFull={isFull}
				started={started}
				showChip={gameState.gameId !== "-1" && !gameState.gameId.includes("Costume-Game-")}
				timerState={timerState}
				setTimerState={setTimerState}
				disappear={chipDisappear}
				setDisappear={setChipDisappear}
			/>
		</>
	)
})

TTTModals.displayName = "TTTModals"