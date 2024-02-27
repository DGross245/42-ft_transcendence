"use client"

import React, { useCallback, useEffect, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";

import { usePongGameState } from "@/app/[lang]/pong/hooks/usePongGameState";
import { usePongSocket } from "@/app/[lang]/pong/hooks/usePongSocket";
import { usePongUI } from "@/app/[lang]/pong/hooks/usePongUI";
import { useKey } from "../hooks/useKey";
import useContract, { PlayerScore } from "@/components/hooks/useContract";
import { initialPongPlayerState } from "@/app/[lang]/pong/context/PongSockets";
import { ChevronDownIcon } from "../icons";

const EndModal =  React.memo(() => {
	// Provider hooks
	const {
		pongGameState,
		winner,
		isGameMode,
		tournament,
		updatePongGameState,
		setStarted,
		scores
	} = usePongGameState();
	const {
		playerStatus,
		requestRematch,
		setSendRequest,
		sendRequest,
		playerState,
		wsclient,
		setPlayerState,
		timerState,
		setChipDisappear
	} = usePongSocket();

	// Normal hooks
	const {
		openModal,
		closeModal,
		showModal
	} = usePongUI();
	const escape = useKey(['Escape'])
	const {
		submitGameResultRanked,
		submitGameResultTournament,
		getTournament
	} = useContract();

	// State variables
	const [showResult, setShowResult] = useState("");
	const [wasOpen, setWasOpen] = useState(false);
	const [isClicked, setIsClicked] = useState(false);

	// Function to handle sending player scores and continuing the game
	const sendScoreAndContinue = async () => {
		if (playerState.client === 0 || playerStatus === "disconnect" || playerStatus === "leave" ) {
			const maxClient = isGameMode ? 4 : 2;
			const playerScore: PlayerScore[] = [];

			for (let i = 0; i < maxClient; i++) {
				playerScore.push({
					addr: playerState.players[i].addr, score: scores.p1Score * 100,
				})
			}
			if (tournament.id !== -1) {
				const lol = getTournament(tournament.id);
				const finished = (await lol).games[tournament.index].finished
				if (!finished)
					await submitGameResultTournament(tournament.id, tournament.index, playerScore);
			} else if (playerState.client === 0) {
				await submitGameResultRanked(playerScore);
			}
			
		}
		const status = await wsclient?.updateStatus(false, pongGameState.gameId);
		wsclient?.leave();
		closeModal();
		updatePongGameState({ gameId: "-1", pause: true, reset: true });
		setPlayerState(initialPongPlayerState());
		setStarted(false);
		setChipDisappear(false);
		if (status) {
			if (tournament.id !== -1) {
				wsclient?.requestTournament(tournament.id, 'Pong');
			} else {
				wsclient?.joinQueue('Pong');
			}
		}
	}

	// Click handler for preventing clicking a button multiple times
	const handleNextClick = async () => {
		if (!isClicked) {
			setIsClicked(true);
			await sendScoreAndContinue();
			setIsClicked(false);
		}
	};

	// Handles the closing of the modal, triggering the appearance of the modal button
	const enableButton = useCallback(() => {
		closeModal();
		setWasOpen(true);
	}, [closeModal])

	// Closing the modal on reset event
	useEffect(() => {
		if (pongGameState.reset) {
			closeModal();
			setWasOpen(false);
		}
	}, [closeModal, pongGameState.reset]);

	// Changes text based on winner
	useEffect (() => {
		if (showModal) {
			if (winner === String(playerState.players[0].number + 1) || (winner === '' && playerStatus === "disconnect")) {
				setShowResult("Wins");
			} else {
				setShowResult("Loses");
			}
		}
	}, [showModal, winner, playerStatus, playerState.players]);

	// Key handler for opening the modal using the Esc key
	useEffect(() => {
		if (escape.isKeyDown && pongGameState.gameOver) {
			openModal();
		}
	}, [escape.isKeyDown, pongGameState.gameOver, openModal]);

	return (
		<>
			<div style={{ position: 'fixed', top: '90%', left: '50%', transform: 'translate(-50%, -50%)', overflow: 'visible' }}>
				{!showModal && pongGameState.gameOver && wasOpen && 
					<Button isIconOnly size="lg" variant="shadow" className="bordered-button" onClick={openModal}>
						<ChevronDownIcon />
					</Button>
				}
			</div>
			<Modal
				backdrop="opaque"
				isOpen={showModal}
				onClose={enableButton}
				classNames={{
					backdrop: 'bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20'
				}}
				style={{
					backgroundColor: 'rgba(25, 25, 25, 0.5)',
					position: 'relative',
					overflow: 'visible',
					backdropFilter: 'blur(5px)',
				}}
				motionProps={{
					variants: {
					  enter: {
						y: -20,
						opacity: 1,
						transition: {
							duration: 0.2,
							ease: "easeIn",
						},
					  },
					  exit: {
						y: 0,
						opacity: 0,
						transition: {
							duration: 0.3,
							ease: "easeOut",
						},
					  },
					}
				  }}
			>
				<ModalContent style={{ position: 'relative', overflow: 'visible' }}>
					<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
						<ModalHeader className="flex flex-col gap-1 items-center justify-center">
							{ showResult }
						</ModalHeader>
					</div>
					<ModalBody style={{ textAlign: 'center' }} >
						{ playerStatus === "disconnect" && timerState !== 'cross' && (<p style={{ color: 'grey' }}> Your opponent disconnected </p>) }
						{ playerStatus === "disconnect" && timerState === 'cross' && (<p style={{ color: 'grey' }}> Your opponent didn&apos;t connect </p>) }
						{ playerStatus === "leave" && <p style={{ color: 'grey' }}> Your opponent left </p> }
					</ModalBody>
					<ModalFooter className="flex justify-center">
						<Button color="danger" variant="ghost" onClick={enableButton}>
							Leave
						</Button>
						{tournament.id !== -1 ? (
							<Button color="primary" variant={"shadow"} onClick={handleNextClick} isDisabled={isClicked} isLoading={isClicked} >
								Next Match
							</Button>
						) : (
							pongGameState.gameId.includes("Costome-Game-") ? (
							<Button color="primary" isDisabled={playerStatus !== ""} variant={ requestRematch ? "shadow" : "ghost"} onClick={() => setSendRequest(true)} isLoading={sendRequest}>
								Rematch
							</Button>
						) : (
								<Button color="primary" variant={"ghost"} onClick={sendScoreAndContinue} isDisabled={isClicked}>
									{ isClicked ? "In Queue" : "Find Match" }
								</Button>
							)
						)}
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
});

EndModal.displayName = "EndModal"

export default EndModal;