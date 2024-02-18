import { useGameState } from "@/app/tic-tac-toe/hooks/useGameState";
import EndModal from "./EndModal";
import { PauseModal } from "../PauseModal";
import { useSocket } from "@/app/tic-tac-toe/hooks/useSocket";

export function TTTModals() {
	const { gameState, isGameMode } = useGameState();
	const { continueIndex, setSendContinueRequest} = useSocket();

	const handleButtonClick = () => {
		setSendContinueRequest(true);
	};

	return (
		<>
			<PauseModal
				gameState={gameState}
				continueIndex={continueIndex}
				handleButtonClick={handleButtonClick}
				maxClient={isGameMode ? 3 : 2}
			/>
			<EndModal />
		</>
	)
}