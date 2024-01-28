import { useSound } from "@/components/Sound";
import inputHandler from "@/components/inputHandler";
import { useEffect, useState } from "react";

// Used to track user moves for validation.
// '' = empty position, 'X' or 'O' updated on user click.
// Used to validate winning combinations.
const initialBoard = () =>  {
	return (
		[
			[
				['', '', '', ''],
				['', '', '', ''],
				['', '', '', ''],
				['', '', '', ''],
			],
			[
				['', '', '', ''],
				['', '', '', ''],
				['', '', '', ''],
				['', '', '', ''],
			],
			[
				['', '', '', ''],
				['', '', '', ''],
				['', '', '', ''],
				['', '', '', ''],
			],
			[
				['', '', '', ''],
				['', '', '', ''],
				['', '', '', ''],
				['', '', '', ''],
			],
		]
	);
}

// Initial coordinates for each field in the scene.
// Each [0, 0, 0] represents the coordinates of a field.
// Set on field creation.
const initialSceneCoords = [
	[
		[[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
		[[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
		[[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
		[[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
	],
	[
		[[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
		[[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
		[[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
		[[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
	],
	[
		[[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
		[[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
		[[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
		[[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
	],
	[
		[[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
		[[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
		[[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
		[[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
	],
];

// Represents the 3 coordinates forming a winning line.
// Extracted from initialSceneCords after finding a winner.
const winningCoords : [number, number, number][] = [
	[-1, -1, -1],[-1, -1, -1],[-1, -1, -1],[-1, -1, -1]
];

export const useGameState = ( maxClients: number ) => {
	const [showFinishLine, setShowFinishLine] = useState(false);
	const [colour, setColour] = useState(0xffffff);

	const [currentTurn, setTurn] = useState('');
	const [board, setCurrentBoardState] = useState(initialBoard());
	const [sceneCoords, setSceneCoords] = useState([...initialSceneCoords]);
	const [coords, setCoords] = useState([...winningCoords]);
	const [isGameOver, setGameOver] = useState(false);
	const [winner, setWinner] = useState('');
	const [countdownVisible, setCountdownVisible] = useState(true);
	const [reset, setReset] = useState(false);

	const soundEngine = useSound();
	const keyMap = inputHandler();
	
	const [showModal, setShowModal] = useState(false);

	const [sendRequest, setSendRequest] = useState(false);
	const [requestRematch, setRequestRematch] = useState(false);
	const [disable, setDisable] = useState(false);
	const [rematchIndex, setRematchIndex] = useState(0);

	const closeModal = () => {
		setShowModal(false);
	}

	const openModal = () => {
		soundEngine?.playSound("win");
		//losing1();
		//losing2();
		setShowModal(true);
	}

	// Handling the reset of the scene, resetting important states.
	useEffect(() => {
		if (reset) {
			closeModal();
			setCurrentBoardState(initialBoard());
			setTurn('');
			setShowFinishLine(false);
			setCoords([...winningCoords]);
			setColour(0xffffff);
			setGameOver(false);
			setWinner('');
			setCountdownVisible(true);
			setReset(false);
		}
	}, [reset]);

	useEffect(() => {
		if (rematchIndex === maxClients) {
			setRequestRematch(false);
			setSendRequest(false);
			setReset(true);
		}
	}, [rematchIndex]);

	useEffect(() => {
		if (!countdownVisible)
			setTurn('X');
	}, [countdownVisible]);

	// Opens the EndModal after a delay if the 'gameOver' state is true.
	useEffect(() => {
		if (isGameOver) {
			const delay = 2000;
			const modalTimeout = setTimeout(() => {
				openModal();
			}, delay);

			return (() => {
				clearTimeout(modalTimeout)
			});
		}
	}, [isGameOver]);

	return {
		currentTurn, setTurn,
		board, setCurrentBoardState,
		sceneCoords, setSceneCoords,
		showFinishLine, setShowFinishLine,
		coords, setCoords,
		colour, setColour,
		showModal, setShowModal,
		isGameOver, setGameOver,
		winner, setWinner,
		countdownVisible, setCountdownVisible,
		reset, setReset,
		initialSceneCoords,winningCoords,initialBoard,
		keyMap, closeModal, openModal,
		sendRequest, setSendRequest,
		requestRematch, setRequestRematch,
		disable, setDisable,
		rematchIndex, setRematchIndex
	};
};