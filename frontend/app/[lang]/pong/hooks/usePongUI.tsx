import { useSound } from "@/components/hooks/Sound";
import { useCallback, useEffect, useState } from "react";
import { usePongGameState } from "./usePongGameState";
import { usePongSocket } from "./usePongSocket";

export const usePongUI = () => {
	const [showModal, setShowModal] = useState(false);
	const { pongGameState, winner } = usePongGameState();
	const { playerState, playerStatus } = usePongSocket();
	const playSound = useSound();

	const closeModal = useCallback(() => {
		setShowModal(false);
	}, []);

	const openModal = useCallback(() => {
		setShowModal(true);
	}, []);

	// Opens the EndModal after a delay if the 'gameOver' state is true.
	useEffect(() => {
		if (pongGameState.gameOver) {
			const delay = 2000;
			const modalTimeout = setTimeout(() => {
				openModal();
				if (playerStatus !== 'leave') {
					if (playerStatus === "unavailable") {
						playSound("silly");
					} else if (winner === String(playerState.players[0].number + 1) || (winner === '' && playerStatus === "disconnect")) {
						playSound("win");
					} else {
						playSound("losing");
					}
				}
			}, delay);
			
			return (() => {
				clearTimeout(modalTimeout)
			});
		}
	}, [pongGameState.gameOver, openModal, winner, playerStatus, playerState.players, playSound]);

	return {
		closeModal,
		openModal,
		showModal,
		setShowModal
	}
}
