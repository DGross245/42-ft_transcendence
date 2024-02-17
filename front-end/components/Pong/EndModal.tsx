"use client"

import React, { useEffect, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { useKey } from "../hooks/useKey";
import { usePongGameState } from "@/app/pong/hooks/usePongGameState";
import { usePongUI } from "@/app/pong/hooks/usePongUI";
import { usePongSocket } from "@/app/pong/hooks/usePongSocket";
import { PlayerScore } from "@/app/useContract";

const EndModal = ({topic, submitGameResultTournament}) => {
	// Provider hooks
	const {
		pongGameState,
		winner,
		isGameMode,
		tournament,
		setPongGameState
	} = usePongGameState();
	const {
		disconnected,
		requestRematch,
		setSendRequest,
		sendRequest,
		playerState,
		wsclient
	} = usePongSocket();

	// Normal hooks
	const {
		openModal,
		closeModal,
		showModal
	} = usePongUI();
	const escape = useKey(['Escape'])

	// State variables
	const [showResult, setShowResult] = useState("");

	const getResult = () => {
		if (winner === String(playerState.players[0].number + 1) || (winner === '' && disconnected))
			return ('Wins');
		else
			return ('Loses');
	};

	const sendScoreAndContinue = async () => {
		if (playerState.client === 0 || disconnected) {
			const maxClient = isGameMode ? 3 : 2;
			const playerScore: PlayerScore[] = [];

			for (let i = 0; i < maxClient; i++) {
				playerScore.push({
					addr: playerState.players[i].addr, score: 1,
				})
			}
			if (tournament.id !== -1)
				await submitGameResultTournament(tournament.id, tournament.index, playerScore);
			// else
				// await submitGameResultRanked(playerScore);
		}
		const status = await wsclient?.updateStatus(false, pongGameState.gameId);
		if (status) {
			setPongGameState({ ...pongGameState, reset: true, pause: true, gameId: "-1" });
			if (tournament.id !== -1)
				wsclient?.requestTournament(topic, 'TTT');
		}
	}

	useEffect(() => {
		if (pongGameState.reset)
			closeModal();
	},[pongGameState.reset]);

	useEffect (() => {
		if (showModal)
			setShowResult(getResult());
	}, [showModal]);

	useEffect(() => {
		if (escape.isKeyDown && pongGameState.gameOver)
			openModal();
	},[escape]);

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
						{tournament.id !== -1 ? (
							<Button color="primary" variant={"shadow"} onClick={() => sendScoreAndContinue()} >
								Next
							</Button>
						) : (
							pongGameState.gameId.includes("Costume-Game-") ? (
							<Button color="primary" isDisabled={disconnected} variant={ requestRematch ? "shadow" : "ghost"} onClick={() => setSendRequest(true)} isLoading={sendRequest}>
								Rematch
							</Button>
						) : (
								<Button color="primary" variant={"ghost"} onClick={() => sendScoreAndContinue()} >
									Queue
								</Button>
							)
						)}
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