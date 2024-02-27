"use client"

import {
	ReactNode,
	createContext,
	useState,
	Dispatch,
	SetStateAction,
	MutableRefObject,
	useRef,
	useCallback
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
	playerPaddle: {
		ref?:  MutableRefObject<Mesh> | null,
		pos: number,
		maxPos: number,
		minPos: number
	},
	setPlayerPaddle: Dispatch<SetStateAction<PongGameStateContextValue['playerPaddle']>>,
	setScores: Dispatch<SetStateAction<PongGameStateContextValue['scores']>>,
	updatePongGameState: (newState: Partial<PongGameStateContextValue['pongGameState']>) => void,
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
	camPos: [number, number, number],
	setCamPos: Dispatch<SetStateAction<[number, number, number]>>,
	countdownRot: [number, number, number],
	setCountdownRot: Dispatch<SetStateAction<[number, number, number]>>,
	countdownPos: [number, number, number][],
	setCountdownPos: Dispatch<SetStateAction<[number, number, number][]>>,
	tournament: {id: number, index: number},
	setTournament: Dispatch<SetStateAction<{id: number, index: number}>>,
	started: boolean,
	setStarted: Dispatch<SetStateAction<boolean>>,
}

export const PongGameStateContext = createContext<PongGameStateContextValue>({} as PongGameStateContextValue);

export const PongGameState: React.FC<{ gameMode:boolean, isBotActive: boolean, children: ReactNode }> = ({ gameMode = false, isBotActive = false, children }) => {
	const [scores, setScores] = useState({ p1Score: 0, p2Score: 0, p3Score: 0, p4Score: 0 })
	const [tournament, setTournament] = useState({
		id: -1,
		index: -1,
	});
	const [pongGameState, setPongGameState] = useState({ gameId: "-1", pause: true, reset: false, gameOver: false });
	const [winner, setWinner] = useState("");
	const [botState, setBot] = useState({ isActive: isBotActive, strength: 100, client: -1 });
	const [isScoreVisible, setScoreVisibility] = useState(false);
	const [isBallVisible, setBallVisibility] = useState(true);
	const [isGameMode] = useState(gameMode);
	const [camPos, setCamPos] = useState<[number, number, number]>([0, 350, 400]);
	const [countdownRot, setCountdownRot] = useState<[number, number, number]>([0, 0, 0]);
	const [countdownPos, setCountdownPos] = useState<[number, number, number][]>([ [-23, 50, 0], [-35, 50, 0] ]);
	const [started, setStarted] = useState(false);
	const rightPaddleRef = useRef<Mesh>(null) as MutableRefObject<Mesh>;
	const leftPaddleRef = useRef<Mesh>(null) as MutableRefObject<Mesh>;
	const topPaddleRef = useRef<Mesh>(null) as MutableRefObject<Mesh>;
	const bottomPaddleRef = useRef<Mesh>(null) as MutableRefObject<Mesh>;
	const ballRef = useRef<Mesh>(null) as MutableRefObject<Mesh>;
	const [playerPaddle, setPlayerPaddle] = useState<PongGameStateContextValue['playerPaddle']>({ ref: null, pos: 0, minPos: 0, maxPos: 0});

	const updatePongGameState = useCallback((newState: Partial<PongGameStateContextValue['pongGameState']>) => {
		setPongGameState(prevState => ({
			...prevState,
			...newState,
		}));
	}, []);

	const value: PongGameStateContextValue = {
		scores,
		setScores,
		pongGameState,
		updatePongGameState,
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
		isGameMode,
		camPos,
		setCamPos,
		countdownRot,
		setCountdownRot,
		countdownPos,
		setCountdownPos,
		playerPaddle,
		setPlayerPaddle,
		tournament,
		setTournament,
		started,
		setStarted
	};

	return (
		<PongGameStateContext.Provider value={ value } >
			{children}
		</PongGameStateContext.Provider>
	);
}