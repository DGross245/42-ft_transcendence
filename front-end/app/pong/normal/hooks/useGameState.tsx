import { useEffect, useState } from "react";

export const useGameState = () => {
	const [p1Score, setP1Score] = useState(0);
	const [p2Score, setP2Score] = useState(0);
	const [showModal, setShowModal] = useState(false);
	const [winner, setWinner] = useState('');
	const [isScoreVisible, setScoreVisibility] = useState(false);
	const [isBallVisible, setBallVisibility] = useState(true)
	const [isGameOver, setGameOver] = useState(false);
	const [resetGame, setReset] = useState(false);

	const [sendRequest, setSendRequest] = useState(false);
	const [requestRematch, setRequestRematch] = useState(false);
	const [disable, setDisable] = useState(false);

	const closeModal = () => {
		setShowModal(false);
	}

	const openModal = () => {
		setShowModal(true);
	}

	useEffect(() => {
		if (requestRematch && sendRequest) {
			setRequestRematch(false);
			setSendRequest(false);
			setReset(true);
		}
	}, [requestRematch, sendRequest]);

	// Handles the reset of the scene when the 'reset' state changes.
	useEffect(() => {
		if (resetGame) {
			setBallVisibility(true);
			setGameOver(false);
			closeModal();
			setReset(false);
			setP1Score(0);
			setP2Score(0);
			setWinner('');
			setScoreVisibility(false);
		}
	}, [resetGame]);

	// Opens the EndModal after a delay if the game ist over = 'isGameOver' state is true.
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
		sendRequest, setSendRequest,
		requestRematch, setRequestRematch,
		p1Score,setP1Score,
		p2Score, setP2Score,
		showModal, setShowModal,
		winner, setWinner,
		isScoreVisible, setScoreVisibility,
		isBallVisible, setBallVisibility,
		isGameOver, setGameOver,
		resetGame, setReset,
		closeModal, openModal,
		disable, setDisable,
	};
}