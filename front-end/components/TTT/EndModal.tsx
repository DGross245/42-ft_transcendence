"use client"

import React, { useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";

import { useGameState } from "@/app/tic-tac-toe/hook/useGameState";
import { useUI } from "@/app/tic-tac-toe/hook/useUI";
import { useSocket } from "@/app/tic-tac-toe/hook/useSocket";
import { useKey } from "../useKey";

const EndModal = () => {
	const { winner, gameState } = useGameState();
	const { disconnected, requestRematch, setSendRequest, sendRequest } = useSocket();
	const { showModal, closeModal, openModal } = useUI();

	const getWinnerImage = () => {
		if (winner == 'O')
			return ('/images/o.png');
		else if (winner == 'X')
			return ('/images/x.png');
		else if (winner === '🔳')
			return ('/images/square.png')
		else
			return ('/images/draw.png');
	}

	const escape = useKey(['Escape'])

	useEffect(() => {
		if (escape.isKeyDown && gameState.gameOver)
			openModal();
	},[escape]);

	useEffect(() => {
		if (gameState.reset)
			closeModal();
	},[gameState.reset])
	return (
		<>
			<Modal
				backdrop="opaque"
				isOpen={showModal}
				onClose={closeModal}
				classNames={{
					backdrop: 'bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20'
				}}
				style={{
					backgroundColor: 'rgba(25, 25, 25, 0.5)',
					position: 'relative',
					overflow: 'visible',
					backdropFilter: 'blur(5px)',
				}}
			>
				<ModalContent style={{ position: 'relative', overflow: 'visible' }}>
					<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
					{showModal && (
						<div style={{ marginTop: '20px' }}>
							<img
								src={getWinnerImage()}
								style={{
									width: winner === 'draw' ? '160px' : '80px',
									height: '80px',
								}}
								alt="Image"
							/>
						</div>
					)}
					<ModalHeader className="flex flex-col gap-1 items-center justify-center">
						{winner === 'draw' ? 'Draw' : 'Wins' }
					</ModalHeader>
					</div>
					<ModalBody >
					</ModalBody>
					<ModalFooter className="flex justify-center">
					<Button color="danger" variant="ghost" onClick={closeModal}>
						Close
					</Button>
					<Button color="primary" isDisabled={disconnected} variant={ requestRematch ? "shadow" : "ghost"} onClick={() => setSendRequest(true)} isLoading={sendRequest}>
						Rematch
					</Button>
					<Button color="success" variant="ghost" onClick={closeModal}>
						View
					</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}

export default EndModal;