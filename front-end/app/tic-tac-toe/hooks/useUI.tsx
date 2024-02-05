import { useEffect, useState } from "react";

import { useSound } from "@/components/hooks/Sound";
import { useGameState } from "./useGameState";
import { useSocket } from "./useSocket";

export const useUI = () => {
	const [showModal, setShowModal] = useState(false);
	const soundEngine = useSound();
	const { gameState, winner } = useGameState();
	const { playerState } = useSocket();

	const closeModal = () => {
		setShowModal(false);
	}

	const openModal = () => {
		setShowModal(true);
	}

	// Opens the EndModal after a delay if the 'gameOver' state is true.
	useEffect(() => {
		if (gameState.gameOver) {
			const delay = 2000;
			const modalTimeout = setTimeout(() => {
				openModal();
				if (winner === playerState.players[playerState.client].symbol)
					soundEngine?.playSound("win");
				else if (winner === "draw")
					soundEngine?.playSound("door");
				else
					soundEngine?.playSound("losing");
			}, delay);

			return (() => {
				clearTimeout(modalTimeout)
			});
		}
	}, [gameState.gameOver]);

	return {
		closeModal,
		openModal,
		showModal,
		setShowModal
	}
}