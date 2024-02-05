import { useSound } from "@/components/hooks/Sound";
import { useEffect, useState } from "react";
import { usePongGameState } from "./usePongGameState";
import { usePongSocket } from "./usePongSocket";

export const usePongUI = () => {
	const [showModal, setShowModal] = useState(false);
	const { pongGameState, winner } = usePongGameState();
	const { playerState } = usePongSocket();
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
				if (winner) // fix later need to use real winner
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
	}, [pongGameState.gameOver]);

	return {
		closeModal,
		openModal,
		showModal,
		setShowModal
	}
}