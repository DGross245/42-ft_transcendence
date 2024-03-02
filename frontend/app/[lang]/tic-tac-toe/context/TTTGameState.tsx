import {
	ReactNode,
	createContext,
	useState,
	Dispatch,
	SetStateAction,
	useCallback,
	useEffect
} from "react";

/**
 * Returns the initial state of the game board.
 * The board is a 3D array representing a 4x4x4 grid.
 * Each cell can be empty (''), 'X', 'O', or '🔳'.
 */
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

/**
 * Represents the inital position of each field in the board array.
 * Each cell in the array corresponds to a field on the in-game board.
 * The position of each field is represented as [row, column, depth].
 * The coords set in each field are not true positions of the in-game board
 * field, rather its own posiiton in the array.
 */
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

/**
 * Represents the coordinates of the fields forming a winning line.
 * These coordinates are extracted from the initialSceneCoords array after a winner is found.
 */
export const winningCoords : [number, number, number][] = [
	[-1, -1, -1],[-1, -1, -1],[-1, -1, -1],[-1, -1, -1]
];


interface GameStateContextValue {
	/** Represents the current game state */
	gameState: {
		/** Unique identifier for the game instance. */
		gameId: string,
		/** Indicates whether the game is currently paused. */
		pause: boolean,
		/** Toggles whether the game should reset. */
		reset: boolean,
		/** Indicates whether the game is currently over. */
		gameOver: boolean,
	},
	updateGameState: (newState: Partial<GameStateContextValue['gameState']>) => void,
	/** Represents the current bot state */
	botState: {
		/** Indicates if the bot is active. */
		isActive: boolean,
		/** Specifies the symbol used by the bot. */
		symbol: string,
		/** Indicates the bot's strength level. */
		strength: number,
		/** Represents the simulated client number. */
		client: number
	},
	/** Setter for '{@link botState}' */
	setBot: Dispatch<SetStateAction<GameStateContextValue['botState']>>,
	/** Represents the current player's symbol ('X', 'O', or '🔳').*/
	currentTurn: string,
	/** Setter for '{@link currentTurn}'. Changes only to these states: '', 'X', 'O', or '🔳'. */
	setTurn: Dispatch<SetStateAction<string>>,
	/** Represents the Board as an array @see {@link initialBoard} */
	board: string[][][],
	/** Sets '{@link board}' the current game board state. */
	setBoard: Dispatch<SetStateAction<string[][][]>>,
	/** Represents the positions of game board fields. @see {@link initialSceneCoords}*/
	sceneCoords: number[][][][],
	/** Sets '{@link sceneCoords}' the positions of game board fields. */
	setSceneCoords: Dispatch<SetStateAction<number[][][][]>>,
	/** Stores the winner's symbol ('X', 'O', or '🔳'). */
	winner: string,
	/** Sets the winner's symbol to empty  ('') or ('X', 'O', or '🔳'). */
	setWinner: Dispatch<SetStateAction<string>>,
	/** Represents the coordinates of the fields forming a winning line. @see {@link winningCoords} */
	lineCoords: [number, number, number][],
	/** Setter for '{@link lineCoords}' */
	setLineCoords: Dispatch<SetStateAction<[number, number, number][]>>,
	/** Controls the visibility of the game countdown. */
	countdownVisible: boolean,
	/** Sets the visibility of the game countdown. */
	setCountdownVisible: Dispatch<SetStateAction<boolean>>,
	/** Indicates if the current game is a game mode. */
	isGameMode: boolean,
	/** Enables the current game mode. */
	setGameMode: Dispatch<SetStateAction<boolean>>,
	/** Controls the visibility of winning lines. */
	isLineVisible: boolean,
	/** Sets the visibility of winning lines. */
	setLineVisible: Dispatch<SetStateAction<boolean>>,
	/** Stores information about the current tournament. */
	tournament: {id: number, index: number},
	/** Sets information about the current tournament. */
	setTournament: Dispatch<SetStateAction<{id: number, index: number}>>,
	/** Indicates whether the game has started. */
	started: boolean,
	/** Sets whether the game has started. */
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
	const [started, setStarted] = useState(false);

	const updateGameState = useCallback((newState: Partial<GameStateContextValue['gameState']>) => {
		setGameState(prevState => ({
			...prevState,
			...newState,
		}));
	}, []);

	useEffect(() => {
		setGameMode(gameMode);
		setBot(prevState => ({ ...prevState, isActive: isBotActive }));
	}, [gameMode, isBotActive]);

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