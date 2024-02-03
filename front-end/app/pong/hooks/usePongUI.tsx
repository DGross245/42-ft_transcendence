import { useSound } from "@/components/hooks/Sound";
import { useEffect, useState } from "react";
import { usePongGameState } from "./usePongGameState";

export const usePongUI = () => {
	const [showModal, setShowModal] = useState(false);
	const { pongGameState } = usePongGameState();
	const soundEngine = useSound();

	const closeModal = () => {
		setShowModal(false);
	}

	const openModal = () => {
		setShowModal(true);
	}

	// Opens the EndModal after a delay if the 'gameOver' state is true.
	useEffect(() => {
		if (pongGameState.gameOver) {
			const delay = 1000;
			const modalTimeout = setTimeout(() => {
				openModal();
			}, delay);

			return (() => {
				clearTimeout(modalTimeout)
			});
		}
	}, [pongGameState.gameOver]);

	return {
		closeModal,
		openModal,
		showModal,
		setShowModal
	}
}