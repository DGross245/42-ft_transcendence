"use client"

import { WSClientType } from '@/helpers/wsclient';
import { MutableRefObject, ReactNode, createContext, useRef, useState } from 'react';
import { Dispatch, SetStateAction } from 'react';
import { Mesh } from 'three'

const initialGameState = {
	gameId: '',
	wsclient: null as WSClientType | null,
	pause: true,
};

interface Player {
	name: string;
	color: number;
	master: boolean;
	number: number;
}

interface PongContextProps {
	playerState: {
		players: Player[],
		client: number
	},
	gameState: {
		gameId: string,
		wsclient: WSClientType | null,
		pause: boolean,
	},
	rightPaddleRef: MutableRefObject<Mesh>,
	leftPaddleRef: MutableRefObject<Mesh>,
	topPaddleRef: MutableRefObject<Mesh>,
	bottomPaddleRef: MutableRefObject<Mesh>,
	ballRef: MutableRefObject<Mesh>,
	updatePlayerState :  Dispatch<SetStateAction<{ players: Player[], client: number }>>,
	updateGameState :  Dispatch<SetStateAction<typeof initialGameState>>
}

const PongContext = createContext<PongContextProps>({} as PongContextProps);

const PongProvider: React.FC<{ children: ReactNode, initialWsClient?: WSClientType | null }> = ({ children, initialWsClient }) => {
	const rightPaddleRef = useRef<Mesh>(null) as MutableRefObject<Mesh>;
	const leftPaddleRef = useRef<Mesh>(null) as MutableRefObject<Mesh>;
	const topPaddleRef = useRef<Mesh>(null) as MutableRefObject<Mesh>;
	const bottomPaddleRef = useRef<Mesh>(null) as MutableRefObject<Mesh>;
	const ballRef = useRef<Mesh>(null) as MutableRefObject<Mesh>;
	const [gameState, setGameState] = useState({ ...initialGameState, wsclient: initialWsClient !== undefined ? initialWsClient : null });
	const [playerState, setPlayerState] = useState({
		players: Array.from({ length: 4 }, () => ({
			name: "None",
			color: 0xffffff,
			master: false,
			number: 0,
		})),
		client: 0
	});

	const updateGameState : Dispatch<SetStateAction<typeof initialGameState>> = ( newState ) => {
		setGameState(prevState => ({
			...prevState,
			...newState,
		}));
	}

	const updatePlayerState :  Dispatch<SetStateAction<{ players: Player[], client: number }>>  = ( newState ) => {
		setPlayerState((prevState) => ({
			...prevState,
			...newState,
		}));
	};

	return (
		<PongContext.Provider
			value={{
				rightPaddleRef, leftPaddleRef, ballRef,
				topPaddleRef, bottomPaddleRef,
				playerState, updatePlayerState,
				gameState, updateGameState,
			}}
		>
			{children}
		</PongContext.Provider>
	);
}

export { PongProvider, PongContext };