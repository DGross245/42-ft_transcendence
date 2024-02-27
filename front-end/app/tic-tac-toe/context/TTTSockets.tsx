import {
	ReactNode,
	createContext,
	useState,
	Dispatch,
	SetStateAction
} from "react";

import { WSClientType } from "@/helpers/wsclient";

export interface Player {
	/** Name of the player */
	name: string;
	/** Wallet adress of the player */
	addr: string;
	/** Color representation of the player */
	color: number;
	/** Player's number (client number) */
	number: number;
	/** Symbol used by the player */
	symbol: string;
}

/**
 * Context value interface for managing socket state and player information.
 */
interface SocketContextValue {
	playerState: {
		/** Array of players  */
		players: Player[];
		 /** Client number */
		client: number;
	};
	/** Setter for '{@link playerState}' */
	setPlayerState: Dispatch<SetStateAction<SocketContextValue['playerState']>>;
	/** WebSocket client */
	wsclient: WSClientType | null;
	/** Setter for WebSocket client */
	setWsclient: Dispatch<SetStateAction<WSClientType | null>>;
	/** Indicates if a request is being sent */
	sendRequest: boolean;
	/** Setter for sendRequest */
	setSendRequest: Dispatch<SetStateAction<boolean>>;
	/** Indicates if a rematch is requested */
	requestRematch: boolean;
	/** Setter for requestRematch */
	setRequestRematch: Dispatch<SetStateAction<boolean>>;
	/** Status of the player (opponent) */
	playerStatus: string;
	/** Setter for playerStatus */
	setPlayerStatus: Dispatch<SetStateAction<string>>;
	/** Index for rematch */
	rematchIndex: number;
	/** Setter for rematchIndex */
	setRematchIndex: Dispatch<SetStateAction<number>>;
	/** Index for continue */
	continueIndex: number;
	/** Setter for continueIndex */
	setContinueIndex: Dispatch<SetStateAction<number>>;
	/** Indicates if a continue request is being sent */
	sendContinueRequest: boolean;
	/** Setter for sendContinueRequest */
	setSendContinueRequest: Dispatch<SetStateAction<boolean>>;
	/** Indicates if the game is full */
	isFull: string;
	/** Setter for isFull */
	setIsFull: Dispatch<SetStateAction<string>>;
	/** State of the timer */
	timerState: string;
	/** Setter for timerState */
	setTimerState: Dispatch<SetStateAction<string>>;
	/** Indicates if chips should disappear */
	chipDisappear: boolean;
	/** Setter for chipDisappear, indicates if the timer */
	setChipDisappear: Dispatch<SetStateAction<boolean>>;
}


/**
 * The function `initialTTTPlayerState` initializes a state object for a Tic Tac Toe game with three
 * players.
 */
export const initialTTTPlayerState = () => ({
	players: Array.from({ length: 3 }, () => ({
		name: "None",
		addr: "UNDEFINED",
		color: 0xffffff,
		number: -1,
		symbol: "UNDEFINED",
	})),
	client: -1
});

export const SocketContext = createContext<SocketContextValue>({} as SocketContextValue);

export const Socket: React.FC<{ initialWsClient?: WSClientType | null, children: ReactNode }> = ({ initialWsClient, children }) => {
	const [wsclient, setWsclient] = useState( initialWsClient !== undefined ? initialWsClient : null);
	const [sendRequest, setSendRequest] = useState(false);
	const [requestRematch, setRequestRematch] = useState(false);
	const [playerStatus, setPlayerStatus] = useState("");
	const [rematchIndex, setRematchIndex] = useState(0);
	const [continueIndex, setContinueIndex] = useState(0);
	const [sendContinueRequest, setSendContinueRequest] = useState(false);
	const [chipDisappear, setChipDisappear] = useState(false);
	const [isFull, setIsFull] = useState("");
	const [timerState, setTimerState] = useState("");
	const [playerState, setPlayerState] = useState(initialTTTPlayerState());

	const value : SocketContextValue = {
		wsclient,
		setWsclient,
		sendRequest,
		setSendRequest,
		requestRematch,
		setRequestRematch,
		playerStatus,
		setPlayerStatus,
		rematchIndex,
		setRematchIndex,
		playerState,
		setPlayerState,
		continueIndex,
		setContinueIndex,
		sendContinueRequest,
		setSendContinueRequest,
		isFull,
		setIsFull,
		timerState,
		setTimerState,
		chipDisappear,
		setChipDisappear
	}

	return (
		<SocketContext.Provider value={ value } >
			{children}
		</SocketContext.Provider>
	);
}
