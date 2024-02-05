"use client"

import React, { useEffect, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";

import { useGameState } from "@/app/tic-tac-toe/hooks/useGameState";
import { useUI } from "@/app/tic-tac-toe/hooks/useUI";
import { useSocket } from "@/app/tic-tac-toe/hooks/useSocket";
import { useKey } from "../hooks/useKey";

// maybe change the View to something like go into queue 

const EndModal = () => {
	const { winner, gameState, isGameMode } = useGameState();
	const { disconnected, requestRematch, setSendRequest, sendRequest, playerState } = useSocket();
	const { showModal, closeModal, openModal } = useUI();
	const [showResult, setShowResult] = useState("");
	const escape = useKey(['Escape']);

	const getOwnImage = () => {
		if (playerState.players[playerState.client].symbol === 'O')
			return ('/images/o.png');
		else if (playerState.players[playerState.client].symbol === 'X')
			return ('/images/x.png');
		else if (playerState.players[playerState.client].symbol === '🔳')
			return ('/images/square.png')
		else if (isGameMode)
			return ('/images/Qubic_draw.png');
		else
			return ('/images/draw.png');
	}

	const getResult = () => {
		if (winner === playerState.players[playerState.client].symbol)
			return ('Wins');
		if (winner === "draw")
			return ('Draw');
		else
			return ('Loses');
	};

	useEffect (() => {
		if (showModal)
			setShowResult(getResult());
	}, [showModal])

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
								src={getOwnImage()}
								style={{
									width: winner === 'draw' ? '160px' : '80px',
									height: '80px',
								}}
								alt="Image"
							/>
						</div>
					)}
					<ModalHeader className="flex flex-col gap-1 items-center justify-center">
						{ showResult }
					</ModalHeader>
					</div>
					<ModalBody style={{ textAlign: 'center' }} >
						{ disconnected && <p style={{ color: 'grey' }}> Your opponent disconnected </p> }
					</ModalBody>
					<ModalFooter className="flex justify-center">
					<Button color="danger" variant="ghost" onClick={closeModal}>
						Leave
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