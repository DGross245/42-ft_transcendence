import React from "react";
import { Modal, ModalContent, ModalHeader, ModalFooter } from "@nextui-org/react";

import { PauseButton } from "./Pause";

export const PauseModal = ({ gameState, continueIndex, handleButtonClick, maxClient, started }) => {
	return (
		<>
			<Modal
				backdrop={"blur"}
				isOpen={started && gameState.pause && !gameState.gameOver && gameState.gameId !== '-1'}
				isDismissable={false}
				style={{
					overflow: 'visible'
				}}
			>
				<ModalContent>
					<ModalHeader className="flex flex-col gap-1 items-center justify-center">
						<div className="flex items-center">
							<span className="pause mr-2"/>
							<span> PAUSE </span>
						</div>
					</ModalHeader>
					<ModalFooter className="flex justify-center">
						<PauseButton
							continueIndex={continueIndex}
							handleButtonClick={handleButtonClick}
							maxClient={maxClient}
						/>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}