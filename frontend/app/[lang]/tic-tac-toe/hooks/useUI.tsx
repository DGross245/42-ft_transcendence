import { useCallback, useEffect, useState } from "react";

import { useSound } from "@/components/hooks/Sound";
import { useGameState } from "./useGameState";
import { useSocket } from "./useSocket";

export const useUI = () => {
	const [showModal, setShowModal] = useState(false);
	const playSound = useSound();
	const { gameState, winner } = useGameState();
	const { playerState, playerStatus } = useSocket();
	const [soundPlayed, setSoundPlayed] = useState(false);

	const closeModal = useCallback(() => {
		setShowModal(false);
	},[])

	const openModal = useCallback(() => {
		setShowModal(true);
	},[])

	// Opens the EndModal after a delay if the 'gameOver' state is true.
	useEffect(() => {
		if (gameState.gameOver && !soundPlayed) {
			const delay = 2000;
			const modalTimeout = setTimeout(() => {
				openModal();
				if (playerStatus !== 'leave') {
					if (playerStatus === "unavailable") {
						playSound("silly");
					} else if ((winner === playerState.players[playerState.client].symbol)) {
						playSound("win");
					} else if (winner === "draw") {
						playSound("disconnect");
					} else {
						playSound("losing");
					}
				}
				setSoundPlayed(true);
			}, delay);

			return (() => {
				clearTimeout(modalTimeout)
			});
		} else if (!gameState.gameOver && soundPlayed) {
			setSoundPlayed(false);
		}
	}, [gameState.gameOver, soundPlayed, openModal, playerStatus, playerState.client, playerState.players, playSound, winner]);
	return {
		closeModal,
		openModal,
		showModal,
		setShowModal
	}
}