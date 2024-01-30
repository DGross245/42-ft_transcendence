import { useSound } from "@/components/Sound";
import { useEffect, useState } from "react";
import { useGameState } from "./useGameState";

export const useUI = () => {
	const [showModal, setShowModal] = useState(false);
	const soundEngine = useSound();
	const { gameState } = useGameState();

	const closeModal = () => {
		setShowModal(false);
	}

	const openModal = () => {
		soundEngine?.playSound("win");
		//losing1();
		//losing2();
		setShowModal(true);
	}


	// Opens the EndModal after a delay if the 'gameOver' state is true.
	useEffect(() => {
		if (gameState.gameOver) {
			const delay = 2000;
			const modalTimeout = setTimeout(() => {
				openModal();
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