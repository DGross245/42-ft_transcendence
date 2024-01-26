import { useContext, useEffect, useState } from "react";
import { PongContext } from "../../PongProvider";

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
	const [disconnected, setDisconnected] = useState(false);
	const [camPos, setCamPos] = useState<[number, number, number]>([0, 350, 400]);
	const [countdownRot, setCountdownRot] = useState<[number, number, number]>([0, 0, 0]);
	const [countdownPos, setContdownPos] = useState<[number, number, number][]>([ [-23, 50, 0], [-35, 50, 0] ]);
	const { playerState } = useContext(PongContext);

	var positionInfo: { 
		camPosition: [number, number, number],
		countdownRotation:[number, number, number],
		countdownPosition: [[number, number, number],
							[number, number, number]]
	}[] = Array.from({ length: 4 }, () => ({
		camPosition: [-1, -1, -1],
		countdownRotation:[-1, -1, -1],
		countdownPosition: [
			[-1, -1, -1],
			[-1, -1, -1],
		]
	}));

	positionInfo[0] = {
		camPosition: [ 0, 350, 400],
		countdownRotation:[0, 0, 0],
		countdownPosition: [
			[-23, 50, 0],
			[-35, 50, 0]
		]
	}
	positionInfo[1] = {
		camPosition: [ -400, 350, 0],
		countdownRotation:[Math.PI / 2, -Math.PI / 2, Math.PI / 2],
		countdownPosition: [
			[0, 50, -23],
			[0, 50, -35]
		]
	}
	positionInfo[2] = {
		camPosition: [ 0, 350, -400],
		countdownRotation:[-Math.PI, 0, Math.PI],
		countdownPosition: [
			[23, 50, 0],
			[35, 50, 0]
		]
	}
	positionInfo[3] = {
		camPosition: [ 400, 350, 0],
		countdownRotation:[-Math.PI / 2, Math.PI / 2, Math.PI / 2],
		countdownPosition: [
			[0, 50, 23],
			[0, 50, 35]
		]
	}

	const closeModal = () => {
		setShowModal(false);
	};

	const openModal = () => {
		setShowModal(true);
	};

	useEffect(() => {
		if (playerState.client !== -1) {
			setCamPos(positionInfo[playerState.client].camPosition);
			const newCountdownPos = [
				positionInfo[playerState.client].countdownPosition[0],
				positionInfo[playerState.client].countdownPosition[1]
			]
			setContdownPos(newCountdownPos);
			setCountdownRot(positionInfo[playerState.client].countdownRotation)
		}
	},[playerState.client, positionInfo]);

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
		disconnected, setDisconnected,
		closeModal, openModal, showModal,
		p1Score, setP1Score, p2Score, setP2Score,
		p3Score, setP3Score, p4Score, setP4Score,
		winner, setWinner, reset, setReset,
		isScoreVisible, setScoreVisibility,
		isBallVisible, setBallVisibility,
		isGameOver, setGameOver,
		camPos,countdownPos,countdownRot
	};
}