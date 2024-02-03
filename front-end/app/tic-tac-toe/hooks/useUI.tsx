import { useEffect, useState } from "react";

import { useSound } from "@/components/Sound";
import { useGameState } from "./useGameState";

export const useUI = () => {
	const [showModal, setShowModal] = useState(false);
	const soundEngine = useSound();
	const { gameState } = useGameState();

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
				soundEngine?.playSound("win");
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