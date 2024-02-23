"use client"

import React, { useCallback, useEffect, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Chip } from "@nextui-org/react";

import { useGameState } from "@/app/tic-tac-toe/hooks/useGameState";
import { useUI } from "@/app/tic-tac-toe/hooks/useUI";
import { useSocket } from "@/app/tic-tac-toe/hooks/useSocket";
import { useKey } from "../hooks/useKey";
import useContract, { PlayerScore } from "@/components/hooks/useContract";
import { ChevronDownIcon } from "../icons";
import { initialTTTPlayerState } from "@/app/tic-tac-toe/context/TTTSockets";
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
	} = useSocket();

	// Normal hooks
	const {
		showModal,
		closeModal,
		openModal
	} = useUI();

	const escape = useKey(['Escape']);

	const { submitGameResultRanked, submitGameResultTournament } = useContract();

	// State variables
	const [showResult, setShowResult] = useState("");
	const [wasOpen, setWasOpen] = useState(false);

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

	const sendScoreAndContinue = async () => {
		if (playerState.client === 0 || playerStatus === "disconnect") {
			const maxClient = isGameMode ? 3 : 2;
			const playerScore: PlayerScore[] = [];

			for (let i = 0; i < maxClient; i++) {
				playerScore.push({
					addr: playerState.players[i].addr, score: winner !== playerState.players[i].symbol ? 0 : 1,
				})
			}
			// if (tournament.id !== -1)
			// 	await submitGameResultTournament(tournament.id, tournament.index, playerScore);
			// else
			// 	await submitGameResultRanked(playerScore);
		}
		const status = await wsclient?.updateStatus(false, gameState.gameId);
		wsclient?.leave();
		closeModal();
		updateGameState({ gameId: "-1", pause: true, reset: true });
		setPlayerState(initialTTTPlayerState());
		setStarted(false);
		if (status) {
			if (tournament.id !== -1) {
				wsclient?.requestTournament(tournament.id, 'TTT');
			}
		}
	}

	const normalClose = useCallback(() => {
		closeModal();
		setWasOpen(true)
	}, [closeModal]);
	
	useEffect(() => {
		if (gameState.reset) {
			closeModal();
			setWasOpen(false);
		}
	}, [gameState.reset, closeModal])

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
				onClose={normalClose}
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
						{ playerStatus === "disconnect" && timerState !== 'cross' && <p style={{ color: 'grey' }}> Your opponent disconnected </p> }
						{ playerStatus === "disconnect" && timerState === 'cross' && <p style={{ color: 'grey' }}> Your opponent didnt connect </p> }
						{ playerStatus === "leave" && <p style={{ color: 'grey' }}> Your opponent left </p> }
					</ModalBody>
					<ModalFooter className="flex justify-center">
						<Button color="danger" variant="ghost" onClick={normalClose}>
							Leave
						</Button>
						{tournament.id !== -1 ? (
							<Button color="primary" variant={"shadow"} onClick={() => sendScoreAndContinue()} >
								Next
							</Button>
						) : (
							gameState.gameId.includes("Costome-Game-") ? (
							<Button color="primary" isDisabled={playerStatus !== ""} variant={ requestRematch ? "shadow" : "ghost"} onClick={() => setSendRequest(true)} isLoading={sendRequest}>
								Rematch
							</Button>
						) : (
							<Button color="primary" variant={"ghost"} onClick={() => sendScoreAndContinue()} >
								Queue
							</Button>
							)
						)}
						<Button color="success" variant="ghost" onClick={normalClose}>
							View
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
});

EndModal.displayName = "EndModal"

export default EndModal;