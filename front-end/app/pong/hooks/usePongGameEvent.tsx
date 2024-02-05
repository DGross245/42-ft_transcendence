import { useEffect, useState } from "react";
import { usePongGameState } from "./usePongGameState";
import { usePongSocket } from "./usePongSocket";

export const usePongGameEvent = ( maxClients: number ) => {
	const { setScores, pongGameState, setPongGameState, setWinner, setBallVisibility, setScoreVisibility } = usePongGameState();
	const { playerState, rematchIndex, setRequestRematch, setSendRequest, setRematchIndex } = usePongSocket();

	const [camPos, setCamPos] = useState<[number, number, number]>([0, 350, 400]);
	const [countdownRot, setCountdownRot] = useState<[number, number, number]>([0, 0, 0]);
	const [countdownPos, setContdownPos] = useState<[number, number, number][]>([ [-23, 50, 0], [-35, 50, 0] ]);

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

	useEffect(() => {
		if (rematchIndex === maxClients) {
			setPongGameState({ ...pongGameState, reset: true })
			setRequestRematch(false);
			setSendRequest(false);
			setRematchIndex(0);
		}
	}, [rematchIndex]);

	return {
		camPos,
		countdownRot,
		countdownPos
	};
}