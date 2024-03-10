import { useSound } from "@/components/hooks/Sound";
import { useCallback, useEffect, useState } from "react";
import { usePongGameState } from "./usePongGameState";
import { usePongSocket } from "./usePongSocket";

export const usePongUI = () => {
	const [showModal, setShowModal] = useState(false);
	const { pongGameState, winner } = usePongGameState();
	const { playerState, playerStatus } = usePongSocket();
	const [soundPlayed, setSoundPlayed] = useState(false);
	const playSound = useSound();

	const closeModal = useCallback(() => {
		setShowModal(false);
	}, []);

	const openModal = useCallback(() => {
		setShowModal(true);
	}, []);

	// Opens the EndModal after a delay if the 'gameOver' state is true.
	useEffect(() => {
		if (pongGameState.gameOver && !soundPlayed) {
			const delay = 2000;
			const modalTimeout = setTimeout(() => {
				openModal();
				if (playerStatus !== 'leave') {
					if (playerStatus === "unavailable") {
						playSound("silly");
					} else if (winner === String(playerState.players[playerState.client].number + 1)) {
						playSound("win");
					} else {
						playSound("losing");
					}
				}
				setSoundPlayed(true);
			}, delay);
			
			return (() => {
				clearTimeout(modalTimeout)
			});
		} else if (!pongGameState.gameOver && soundPlayed) {
			setSoundPlayed(false);
		}
	}, [pongGameState.gameOver, soundPlayed, openModal, winner, playerStatus, playerState.client, playerState.players, playSound]);

	return {
		closeModal,
		openModal,
		showModal,
		setShowModal
	}
}
