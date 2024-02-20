import { usePongGameState } from "@/app/pong/hooks/usePongGameState";
import { usePongSocket } from "@/app/pong/hooks/usePongSocket";
import { PauseModal } from "../PauseModal";
import EndModal from "./EndModal";
import { Timer } from "../Timer";

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

	const handleButtonClick = () => {
		if (!sendContinueRequest)
			setSendContinueRequest(true);
	};

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
				showChip={pongGameState.gameId !== "-1" && !pongGameState.gameId.includes("Costume-Game-")}
				timerState={timerState}
				setTimerState={setTimerState}
				disappear={chipDisappear}
				setDisappear={setChipDisappear}
			/>
		</>
	)
}