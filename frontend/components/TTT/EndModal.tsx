"use client"

import React, { useCallback, useEffect, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";

import { useGameState } from "@/app/[lang]/tic-tac-toe/hooks/useGameState";
import { useUI } from "@/app/[lang]/tic-tac-toe/hooks/useUI";
import { useSocket } from "@/app/[lang]/tic-tac-toe/hooks/useSocket";
import { useKey } from "../hooks/useKey";
import useContract, { PlayerScore } from "@/components/hooks/useContract";
import { ChevronDownIcon } from "../icons";
import { initialTTTPlayerState } from "@/app/[lang]/tic-tac-toe/context/TTTSockets";
import Image from "next/image";

// maybe change the View to something like go into queue 

const EndModal = React.memo(() => {
	// Provider hooks
	const {
		winner,
		gameState,
		isGameMode,
		tournament,
		updateGameState,
		setStarted
	} = useGameState();
	const {
		playerStatus,
		requestRematch,
		setSendRequest,
		sendRequest,
		playerState,
		wsclient,
		timerState,
		setPlayerState,
		setChipDisappear
	} = useSocket();

	// Normal hooks
	const {
		showModal,
		closeModal,
		openModal
	} = useUI();

	const escape = useKey(['Escape']);

	const {
		submitGameResultRanked,
		submitGameResultTournament,
		getTournament
	} = useContract();

	// State variables
	const [showResult, setShowResult] = useState("");
	const [wasOpen, setWasOpen] = useState(false);
	const [isClicked, setIsClicked] = useState(false);

	// Image getter for client
	const getOwnImage = useCallback(() => {
		if (playerState.players[playerState.client]?.symbol === 'O')
			return ('/images/o.png');
		else if (playerState.players[playerState.client]?.symbol === 'X')
			return ('/images/x.png');
		else if (playerState.players[playerState.client]?.symbol === '🔳')
			return ('/images/square.png')
		else if (isGameMode)
			return ('/images/Qubic_draw.png');
		else
			return ('/images/draw.png');
	}, [isGameMode, playerState.client, playerState.players]);

	// Click handler for preventing clicking a button multiple times
	const handleNextClick = async () => {
		if (!isClicked) {
			setIsClicked(true);
			await sendScoreAndContinue();
			setIsClicked(false);
		}
	};

	// Function to handle sending player scores and continuing the game
	const sendScoreAndContinue = async () => {
		if (playerState.client === 0 || playerStatus === "disconnect" || playerStatus === "leave" ) {
			const maxClient = isGameMode ? 3 : 2;
			const playerScore: PlayerScore[] = [];

			for (let i = 0; i < maxClient; i++) {
				playerScore.push({
					addr: playerState.players[i].addr, score: winner !== playerState.players[i].symbol ? 0 : 1000,
				})
			}
			if (tournament.id !== -1) {
				const data = getTournament(tournament.id);
				const finished = (await data).games[tournament.index].finished
				if (!finished)
					await submitGameResultTournament(tournament.id, tournament.index, playerScore);
			} else if (playerState.client === 0) {
				await submitGameResultRanked(playerScore);
			}
		}
		const status = await wsclient?.updateStatus(false, gameState.gameId);
		wsclient?.leave();
		closeModal();
		updateGameState({ gameId: "-1", pause: true, reset: true });
		setPlayerState(initialTTTPlayerState());
		setStarted(false);
		setChipDisappear(false);
		if (status) {
			if (tournament.id !== -1) {
				wsclient?.requestTournament(tournament.id, 'TTT');
			} else {
				wsclient?.joinQueue('TTT');
			}
		}
	}

	// Handles the closing of the modal, triggering the appearance of the modal button
	const enableButton = useCallback(() => {
		closeModal();
		setWasOpen(true)
	}, [closeModal]);

	// Closing the modal on reset event
	useEffect(() => {
		if (gameState.reset) {
			closeModal();
			setWasOpen(false);
		}
	}, [gameState.reset, closeModal])

	// Changes text based on winner
	useEffect (() => {
		if (showModal) {
			if ((winner === playerState.players[playerState.client].symbol) || (winner === '' && playerStatus === "disconnect")) {
				setShowResult('Wins');
			} else if (winner === "draw") {
				setShowResult('Draw');
			} else {
				setShowResult('Loses');
			}
		}
	}, [showModal, playerState, winner, playerStatus])

	// Key handler for opening the modal using the Esc key
	useEffect(() => {
		if (escape.isKeyDown && gameState.gameOver) {
			openModal();
		} 
	}, [escape.isKeyDown, gameState.gameOver, openModal]);

	return (
		<>
			<div style={{ position: 'fixed', top: '90%', left: '50%', transform: 'translate(-50%, -50%)', overflow: 'visible' }}>
				{!showModal && gameState.gameOver && wasOpen && 
					<Button isIconOnly size="lg" variant="shadow" className="bordered-button button-gradient" onClick={openModal}>
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
						{showModal && (
							<div style={{ marginTop: '20px' }}>
								<Image
									src={getOwnImage()}
									width={winner === 'draw' ? 160 : 80}
									height={80}
									alt="Image"
								/>
							</div>
						)}
						<ModalHeader className="flex flex-col gap-1 items-center justify-center">
							{ showResult }
						</ModalHeader>
					</div>
					<ModalBody style={{ textAlign: 'center' }} >
						{ playerStatus === "disconnect" && timerState !== 'cross' && (<p style={{ color: 'grey' }}> Your opponent disconnected </p>) }
						{ playerStatus === "unavailable" && timerState === 'cross' && (<p style={{ color: 'grey' }}> Your opponent didn&apos;t connect </p>) }
						{ playerStatus === "leave" && <p style={{ color: 'grey' }}> Your opponent left </p> }
					</ModalBody>
					<ModalFooter className="flex justify-center">
						<Button color="danger" variant="ghost" onClick={enableButton}>
							Quit
						</Button>
						{tournament.id !== -1 ? (
							<Button color="primary" variant={"shadow"} onClick={handleNextClick} isDisabled={isClicked} isLoading={isClicked} >
								Next Match
							</Button>
						) : (
							gameState.gameId.includes("Costome-Game-") ? (
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