"use client"

import { WSClientType } from '@/helpers/wsclient';
import { ReactNode, createContext, useState } from 'react';
import { Dispatch, SetStateAction } from 'react';

// TODO: Remove stuff I dont use
// TODO: re-think this Provider, maybe is not needed

// const initialBallState = {
// 	position: { x: 0, y: 0 },
// 	velocity: { x: 0, y: 0 },
// };

// const initialPaddleState = {
// 	position: { x: 0, y: 0 },
// };

const initialPlayerState = {
	name: "None",
	color: 0xffffff,
	master: false,
};

const initialOpponentState = {
	name: "None",
	color: 0xffffff,
	master: false,
};

const initialGameState = {
	gameId: '',
	wsclient: null as WSClientType | null,
	pause: true,
};

interface PongContextProps {
	// ballState: {
	// 	position: { x: number, y: number },
	// 	velocity: { x: number, y: number },
	// };
	// paddleState: {
	// 	position: { x: number, y: number },
	// }
	playerState: {
		name: string,
		color: number,
		master: boolean,
	}
	opponentState: {
		name: string,
		color: number,
		master: boolean,
	}
	gameState: {
		gameId: string,
		wsclient: WSClientType | null,
		pause: boolean,
	}
	// updateBallState: Dispatch<SetStateAction<typeof initialBallState>>;
	// updatePaddleState: Dispatch<SetStateAction<typeof initialPaddleState>>;
	updatePlayerState :  Dispatch<SetStateAction<typeof initialPlayerState>>;
	updateOpponentState :  Dispatch<SetStateAction<typeof initialOpponentState>> 
	updateGameState :  Dispatch<SetStateAction<typeof initialGameState>> 
}

const PongContext = createContext<PongContextProps>({} as PongContextProps);

const PongProvider: React.FC<{ children: ReactNode, initialWsClient?: WSClientType | null }> = ({ children, initialWsClient }) => {
	// const [ballState, setBallState] = useState( initialBallState );
	// const [paddleState, setPaddleState] = useState( initialPaddleState );
	const [playerState, setPlayerState] = useState( initialPlayerState ); // could be moved to another provider, like for all games
	const [opponentState, setOpponentState] = useState( initialOpponentState );  // this too
	const [gameState, setGameState] = useState({
		...initialGameState,
		wsclient: initialWsClient !== undefined ? initialWsClient : null,
	});

	const updateGameState : Dispatch<SetStateAction<typeof initialGameState>> = ( newState ) => {
		setGameState(prevState => ({
			...prevState,
			...newState,
		}));
	}

	// const updateBallState : Dispatch<SetStateAction<typeof initialBallState>> = ( newState ) => {
	// 	setBallState(prevState => ({
	// 		...prevState,
	// 		...newState,
	// 	}));
	// };

	// const updatePaddleState : Dispatch<SetStateAction<typeof initialPaddleState>> = ( newState ) => {
	// 	setPaddleState((prevState) => ({
	// 		...prevState,
	// 		...newState,
	// 	}));
	// };

	const updatePlayerState :  Dispatch<SetStateAction<typeof initialPlayerState>>  = ( newState ) => {
		setPlayerState((prevState) => ({
			...prevState,
			...newState,
		}));
	};

	const updateOpponentState :  Dispatch<SetStateAction<typeof initialOpponentState>>  = ( newState ) => {
		setOpponentState((prevState) => ({
			...prevState,
			...newState,
		}));
	};

	return (
		<PongContext.Provider
			value={{
				// ballState, updateBallState, 
				// paddleState, updatePaddleState, 
				playerState, updatePlayerState,
				opponentState, updateOpponentState,
				gameState, updateGameState,
			}}
		>
			{children}
		</PongContext.Provider>
	);
}

export { PongProvider, PongContext };