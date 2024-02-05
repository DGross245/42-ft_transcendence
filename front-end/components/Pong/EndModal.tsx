"use client"

import React, { useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { useKey } from "../hooks/useKey";
import { usePongGameState } from "@/app/pong/hooks/usePongGameState";
import { usePongUI } from "@/app/pong/hooks/usePongUI";
import { usePongSocket } from "@/app/pong/hooks/usePongSocket";

const EndModal = () => {
	const escape = useKey(['Escape'])
	const { pongGameState, winner  } = usePongGameState();
	const { disconnected, requestRematch, setSendRequest, sendRequest } = usePongSocket();
	const { openModal, closeModal, showModal} = usePongUI();

	useEffect(() => {
		if (escape.isKeyDown && pongGameState.gameOver) {}
			openModal();
	},[escape]);

	useEffect(() => {
		if (pongGameState.reset)
			closeModal();
	},[pongGameState.reset])

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
					<ModalHeader className="flex flex-col gap-1 items-center justify-center">
						{ winner === 'draw' ? 'Draw' : 'Wins' }
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