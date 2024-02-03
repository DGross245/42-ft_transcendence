"use client"

import {
	ReactNode,
	createContext,
	useState,
	Dispatch,
	SetStateAction,
	MutableRefObject,
	useRef
} from "react";
import { Mesh } from 'three'

interface PongGameStateContextValue {
	scores: {
		p1Score: number,
		p2Score: number,
		p3Score: number,
		p4Score: number
	},
	pongGameState: {
		gameId: string,
		pause: boolean,
		reset: boolean,
		gameOver: boolean
	},
	botState: {
		isActive: boolean,
		strength: number,
		client: number
	},
	setScores: Dispatch<SetStateAction<PongGameStateContextValue['scores']>>,
	setPongGameState: Dispatch<SetStateAction<PongGameStateContextValue['pongGameState']>>,
	winner: string,
	setWinner: Dispatch<SetStateAction<string>>,
	isScoreVisible: boolean,
	setScoreVisibility: Dispatch<SetStateAction<boolean>>,
	isBallVisible: boolean,
	setBallVisibility: Dispatch<SetStateAction<boolean>>,
	setBot: Dispatch<SetStateAction<PongGameStateContextValue['botState']>>,
	rightPaddleRef: MutableRefObject<Mesh>,
	leftPaddleRef: MutableRefObject<Mesh>,
	topPaddleRef: MutableRefObject<Mesh>,
	bottomPaddleRef: MutableRefObject<Mesh>,
	ballRef: MutableRefObject<Mesh>,
	isGameMode: boolean,
}

export const PongGameStateContext = createContext<PongGameStateContextValue>({} as PongGameStateContextValue);

export const PongGameState: React.FC<{ gameMode:boolean, isBotActive: boolean, children: ReactNode }> = ({ gameMode = false, isBotActive = false, children }) => {
	const [scores, setScores] = useState({ p1Score: 0, p2Score: 0, p3Score: 0, p4Score: 0 })
	const [pongGameState, setPongGameState] = useState({ gameId: "0", pause: true, reset: false, gameOver: false });
	const [winner, setWinner] = useState("");
	const [botState, setBot] = useState({ isActive: isBotActive, strength: 0.9, client: -1 });
	const [isScoreVisible, setScoreVisibility] = useState(false);
	const [isBallVisible, setBallVisibility] = useState(true);
	const [isGameMode] = useState(gameMode);
	const rightPaddleRef = useRef<Mesh>(null) as MutableRefObject<Mesh>;
	const leftPaddleRef = useRef<Mesh>(null) as MutableRefObject<Mesh>;
	const topPaddleRef = useRef<Mesh>(null) as MutableRefObject<Mesh>;
	const bottomPaddleRef = useRef<Mesh>(null) as MutableRefObject<Mesh>;
	const ballRef = useRef<Mesh>(null) as MutableRefObject<Mesh>;

	const value: PongGameStateContextValue = {
		scores,
		setScores,
		pongGameState,
		setPongGameState,
		winner,
		setWinner,
		botState,
		setBot,
		isScoreVisible,
		setScoreVisibility,
		isBallVisible,
		setBallVisibility,
		rightPaddleRef,
		leftPaddleRef,
		topPaddleRef,
		bottomPaddleRef,
		ballRef,
		isGameMode
	};

	return (
		<PongGameStateContext.Provider value={ value } >
			{children}
		</PongGameStateContext.Provider>
	);
}