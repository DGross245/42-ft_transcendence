"use client"

import { WSClientType } from '@/helpers/wsclient';
import { MutableRefObject, ReactNode, createContext, useRef, useState } from 'react';
import { Dispatch, SetStateAction } from 'react';
import { Mesh } from 'three'

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
	rightPaddleRef: MutableRefObject<Mesh>,
	leftPaddleRef: MutableRefObject<Mesh>,
	ballRef: MutableRefObject<Mesh>,
	updatePlayerState :  Dispatch<SetStateAction<typeof initialPlayerState>>;
	updateOpponentState :  Dispatch<SetStateAction<typeof initialOpponentState>> 
	updateGameState :  Dispatch<SetStateAction<typeof initialGameState>>
}

const PongContext = createContext<PongContextProps>({} as PongContextProps);

const PongProvider: React.FC<{ children: ReactNode, initialWsClient?: WSClientType | null }> = ({ children, initialWsClient }) => {
	const [playerState, setPlayerState] = useState( initialPlayerState );
	const [opponentState, setOpponentState] = useState( initialOpponentState );
	const [gameState, setGameState] = useState({ ...initialGameState, wsclient: initialWsClient !== undefined ? initialWsClient : null });
	const rightPaddleRef = useRef<Mesh>(null) as MutableRefObject<Mesh>;
	const leftPaddleRef = useRef<Mesh>(null) as MutableRefObject<Mesh>;
	const ballRef = useRef<Mesh>(null) as MutableRefObject<Mesh>;

	const updateGameState : Dispatch<SetStateAction<typeof initialGameState>> = ( newState ) => {
		setGameState(prevState => ({
			...prevState,
			...newState,
		}));
	}

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
				rightPaddleRef, leftPaddleRef, ballRef,
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