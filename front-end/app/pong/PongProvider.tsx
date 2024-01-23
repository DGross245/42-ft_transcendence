"use client"

import { WSClientType } from '@/helpers/wsclient';
import { MutableRefObject, ReactNode, createContext, useRef, useState } from 'react';
import { Dispatch, SetStateAction } from 'react';
import { Mesh } from 'three'

const initialPlayer1State = {
	name: "None",
	color: 0xffffff,
	master: false,
};

const initialPlayer2State = {
	name: "None",
	color: 0xffffff,
	master: false,
};

const initialPlayer3State = {
	name: "None",
	color: 0xffffff,
	master: false,
};

const initialPlayer4State = {
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
	player1State: {
		name: string,
		color: number,
		master: boolean,
	},
	player2State: {
		name: string,
		color: number,
		master: boolean,
	},
	player3State: {
		name: string,
		color: number,
		master: boolean,
	},
	player4State: {
		name: string,
		color: number,
		master: boolean,
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
	updatePlayer1State :  Dispatch<SetStateAction<typeof initialPlayer1State>>,
	updatePlayer2State :  Dispatch<SetStateAction<typeof initialPlayer2State>> ,
	updatePlayer3State :  Dispatch<SetStateAction<typeof initialPlayer3State>>,
	updatePlayer4State :  Dispatch<SetStateAction<typeof initialPlayer4State>>,
	updateGameState :  Dispatch<SetStateAction<typeof initialGameState>>
}

const PongContext = createContext<PongContextProps>({} as PongContextProps);

const PongProvider: React.FC<{ children: ReactNode, initialWsClient?: WSClientType | null }> = ({ children, initialWsClient }) => {
	const [player1State, setPlayer1State] = useState( initialPlayer1State );
	const [player2State, setPlayer2State] = useState( initialPlayer2State );
	const [player3State, setPlayer3State] = useState( initialPlayer3State );
	const [player4State, setPlayer4State] = useState( initialPlayer4State );
	const [gameState, setGameState] = useState({ ...initialGameState, wsclient: initialWsClient !== undefined ? initialWsClient : null });
	const rightPaddleRef = useRef<Mesh>(null) as MutableRefObject<Mesh>;
	const leftPaddleRef = useRef<Mesh>(null) as MutableRefObject<Mesh>;
	const topPaddleRef = useRef<Mesh>(null) as MutableRefObject<Mesh>;
	const bottomPaddleRef = useRef<Mesh>(null) as MutableRefObject<Mesh>;
	const ballRef = useRef<Mesh>(null) as MutableRefObject<Mesh>;

	const updateGameState : Dispatch<SetStateAction<typeof initialGameState>> = ( newState ) => {
		setGameState(prevState => ({
			...prevState,
			...newState,
		}));
	}

	const updatePlayer1State :  Dispatch<SetStateAction<typeof initialPlayer1State>>  = ( newState ) => {
		setPlayer1State((prevState) => ({
			...prevState,
			...newState,
		}));
	};

	const updatePlayer2State :  Dispatch<SetStateAction<typeof initialPlayer2State>>  = ( newState ) => {
		setPlayer2State((prevState) => ({
			...prevState,
			...newState,
		}));
	};

	const updatePlayer3State :  Dispatch<SetStateAction<typeof initialPlayer3State>>  = ( newState ) => {
		setPlayer3State((prevState) => ({
			...prevState,
			...newState,
		}));
	};

	const updatePlayer4State :  Dispatch<SetStateAction<typeof initialPlayer4State>>  = ( newState ) => {
		setPlayer4State((prevState) => ({
			...prevState,
			...newState,
		}));
	};

	return (
		<PongContext.Provider
			value={{
				rightPaddleRef, leftPaddleRef, ballRef,
				topPaddleRef, bottomPaddleRef,
				player1State, updatePlayer1State,
				player2State, updatePlayer2State,
				player3State, updatePlayer3State,
				player4State, updatePlayer4State,
				gameState, updateGameState,
			}}
		>
			{children}
		</PongContext.Provider>
	);
}

export { PongProvider, PongContext };