import { usePongGameState } from "@/app/pong/hooks/usePongGameState";
import { usePongSocket } from "@/app/pong/hooks/usePongSocket";
import { PauseModal } from "../PauseModal";
import EndModal from "./EndModal";

export function PongModals() {
	const { pongGameState, isGameMode, started } = usePongGameState();
	const { continueIndex, setSendContinueRequest, sendContinueRequest } = usePongSocket();

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
		</>
	)
}