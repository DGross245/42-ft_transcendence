import { usePongGameState } from "@/app/[lang]/pong/hooks/usePongGameState";
import { usePongSocket } from "@/app/[lang]/pong/hooks/usePongSocket";
import { PauseModal } from "../PauseModal";
import EndModal from "./EndModal";
import { Timer } from "../Timer";
import { useCallback, useEffect } from "react";

export function PongModals() {
	const {
		pongGameState,
		isGameMode,
		started,
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
		chipDisappear
	} = usePongSocket();

	const handleButtonClick = useCallback(() => {
		if (!sendContinueRequest)
			setSendContinueRequest(true);
	}, [setSendContinueRequest, sendContinueRequest]);

	return (
		<>
			<PauseModal
				gameState={pongGameState}
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
				showChip={pongGameState.gameId !== "-1" && !pongGameState.gameId.includes("Custom-Game-")}
				timerState={timerState}
				setTimerState={setTimerState}
				disappear={chipDisappear}
				setDisappear={setChipDisappear}
			/>
		</>
	)
}