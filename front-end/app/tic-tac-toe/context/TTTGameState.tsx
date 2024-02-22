import {
	ReactNode,
	createContext,
	useState,
	Dispatch,
	SetStateAction,
	useCallback
} from "react";

// Used to track user moves for validation.
// '' = empty position, 'X' or 'O' updated on user click.
// Used to validate winning combinations.
export const initialBoard = () =>  {
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
export const winningCoords : [number, number, number][] = [
	[-1, -1, -1],[-1, -1, -1],[-1, -1, -1],[-1, -1, -1]
];

interface GameStateContextValue {
	gameState: {
		gameId: string,
		pause: boolean,
		reset: boolean,
		gameOver: boolean,
	},
	botState: {
		isActive: boolean,
		symbol: string,
		strength: number,
		client: number
	},
	setBot: Dispatch<SetStateAction<GameStateContextValue['botState']>>,
	currentTurn: string,
	setTurn: Dispatch<SetStateAction<string>>,
	board: string[][][],
	setBoard: Dispatch<SetStateAction<string[][][]>>,
	sceneCoords: number[][][][],
	setSceneCoords: Dispatch<SetStateAction<number[][][][]>>,
	winner: string,
	setWinner: Dispatch<SetStateAction<string>>,
	updateGameState: (newState: Partial<GameStateContextValue['gameState']>) => void,
	lineCoords: [number, number, number][],
	setLineCoords: Dispatch<SetStateAction<[number, number, number][]>>,
	countdownVisible: boolean,
	setCountdownVisible: Dispatch<SetStateAction<boolean>>,
	isGameMode: boolean,
	setGameMode: Dispatch<SetStateAction<boolean>>,
	isLineVisible: boolean,
	setLineVisible: Dispatch<SetStateAction<boolean>>,
	symbolArray: string[],
	setSymbolArray: Dispatch<SetStateAction<string[]>>,
	tournament: {id: number, index: number},
	setTournament: Dispatch<SetStateAction<{id: number, index: number}>>,
	started: boolean,
	setStarted: Dispatch<SetStateAction<boolean>>,
}

export const GameStateContext = createContext<GameStateContextValue>({} as GameStateContextValue);

export const GameState: React.FC<{ gameMode: boolean, isBotActive: boolean, children: ReactNode }> = ({ gameMode = false, isBotActive = false, children }) => {
	const [isGameMode, setGameMode] = useState(gameMode);
	const [tournament, setTournament] = useState({ id: -1, index: -1 });
	const [countdownVisible, setCountdownVisible] = useState(true);
	const [currentTurn, setTurn] = useState('');
	const [board, setBoard] = useState(initialBoard());
	const [sceneCoords, setSceneCoords] = useState([...initialSceneCoords]);
	const [winner, setWinner] = useState('');
	const [gameState, setGameState] = useState({ gameId: "-1", pause: true, reset: false, gameOver: false });
	const [lineCoords, setLineCoords] = useState([...winningCoords]);
	const [isLineVisible, setLineVisible] = useState(false);
	const [botState, setBot] = useState({ isActive: isBotActive, symbol: 'NOT DEFINED', strength: 0.9, client: -1});
	const [symbolArray, setSymbolArray] = useState(['', '', '']);
	const [started, setStarted] = useState(false);

	const updateGameState = useCallback((newState: Partial<GameStateContextValue['gameState']>) => {
		setGameState(prevState => ({
			...prevState,
			...newState,
		}));
	}, []);

	const value: GameStateContextValue = {
		currentTurn,
		setTurn,
		board,
		setBoard,
		sceneCoords,
		setSceneCoords,
		winner,
		setWinner,
		gameState,
		updateGameState,
		lineCoords,
		setLineCoords,
		countdownVisible,
		setCountdownVisible,
		isGameMode,
		setGameMode,
		isLineVisible,
		setLineVisible,
		botState,
		setBot,
		symbolArray,
		setSymbolArray,
		tournament,
		setTournament,
		started,
		setStarted
	};

	return (
		<GameStateContext.Provider value={ value }>
			{children}
		</GameStateContext.Provider>
	);
};