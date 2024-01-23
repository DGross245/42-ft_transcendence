import { useEffect, useState } from "react";

export const useGameState = () => {
	const [p1Score, setP1Score] = useState(0);
	const [p2Score, setP2Score] = useState(0);
	const [p3Score, setP3Score] = useState(0);
	const [p4Score, setP4Score] = useState(0);
	const [showModal, setShowModal] = useState(false);
	const [winner, setWinner] = useState('');
	const [isGameOver, setGameOver] = useState(false);
	const [isScoreVisible, setScoreVisibility] = useState(false);
	const [reset, setReset] = useState(false);
	const [isBallVisible, setBallVisibility] = useState(true);

	const closeModal = () => {
		setShowModal(false);
	};

	const openModal = () => {
		setShowModal(true);
	};

	// Handles the reset of the scene when the 'reset' state changes.
	useEffect(() => {
		if (reset) {
			setBallVisibility(true);
			setGameOver(false);
			closeModal();
			setReset(false);
			setP1Score(0);
			setP2Score(0);
			setP3Score(0);
			setP4Score(0);
			setWinner('');
			setScoreVisibility(false);
		}
	}, [reset]);

	// Opens the EndModal after a delay if the 'gameOver' state is true.
	useEffect(() => {
		if (isGameOver) {
			const delay = 1000;
			const modalTimeout = setTimeout(() => {
				openModal();
			}, delay);

			return (() => {
				clearTimeout(modalTimeout)
			});
		}
	}, [isGameOver]);

	return {
		closeModal, openModal, showModal,
		p1Score, setP1Score, p2Score, setP2Score,
		p3Score, setP3Score, p4Score, setP4Score,
		winner, setWinner, reset, setReset,
		isScoreVisible, setScoreVisibility,
		isBallVisible, setBallVisibility,
		isGameOver, setGameOver
	};
}