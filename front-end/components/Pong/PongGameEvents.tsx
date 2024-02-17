import { usePongGameState } from "@/app/pong/hooks/usePongGameState";
import { usePongSocket } from "@/app/pong/hooks/usePongSocket";
import { useEffect } from "react";
import { useKey } from "../hooks/useKey";

export const PongGameEvents = ({maxClients} : {maxClients: number} ) => {
	// Provider hooks 
	const {
		setScores,
		pongGameState,
		setPongGameState,
		setWinner,
		setBallVisibility,
		setScoreVisibility,
		setCamPos,
		setCountdownRot,
		setContdownPos,
		isGameMode,
	} = usePongGameState();
	const {
		playerState,
		rematchIndex,
		setRequestRematch,
		setSendRequest,
		setRematchIndex,
		continueIndex,
		setSendContinueRequest,
		setContinueIndex
	} = usePongSocket();

	// Normal hooks
	const escape = useKey(['Escape']);

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

	useEffect(() => {
		if (playerState.client !== -1) {
			if (!isGameMode) {
				setCamPos([0, 400, 100]);
				const newCountdownPos = [
					[-23, 50, 0] as [number, number, number],
					[-35, 50, 0] as [number, number, number]
				]
				setContdownPos(newCountdownPos);
				setCountdownRot([-Math.PI /2, 0, 0]);
				return ;
			}
			setCamPos(positionInfo[playerState.client].camPosition);
			const newCountdownPos = [
				positionInfo[playerState.client].countdownPosition[0],
				positionInfo[playerState.client].countdownPosition[1]
			]
			setContdownPos(newCountdownPos);
			setCountdownRot(positionInfo[playerState.client].countdownRotation)
		}
	},[playerState.client]);

	// Handles the reset of the scene when the 'reset' state changes.
	useEffect(() => {
		if (pongGameState.reset) {
			setBallVisibility(true);
			setScores({ p1Score: 0, p2Score: 0, p3Score: 0, p4Score: 0 });
			setWinner('');
			setScoreVisibility(false);
			setPongGameState({ ...pongGameState, reset: false, gameOver: false });
		}
	}, [pongGameState.reset]);

	// Handle pause when esc is pressed
	useEffect(() => {
		if (escape.isKeyDown && !pongGameState.gameOver)
			setPongGameState({ ...pongGameState, pause: true});
	},[escape])

	// Execute reset when all players want a rematch
	useEffect(() => {
		// Check if all players have requested a rematch
		if (rematchIndex === maxClients) {
			// Update game state to trigger a reset
			setPongGameState({ ...pongGameState, reset: true })

			// Reset rematch-related flags
			setRequestRematch(false);
			setSendRequest(false);
			setRematchIndex(0);
		}
	}, [rematchIndex]);

	// Resumes the game when all players want to continue.
	useEffect(() => {
		// Check if all players have requested to continue.
		if (continueIndex === (isGameMode ? 3 : 2)) {
			// Update game state to trigger a resume of the game
			setPongGameState({ ...pongGameState, pause: false});

			// Reset pause-related flags
			setSendContinueRequest(false);
			setContinueIndex(0);
		}
	}, [continueIndex]);

	return (null);
}