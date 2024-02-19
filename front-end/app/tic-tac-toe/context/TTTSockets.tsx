import {
	ReactNode,
	createContext,
	useState,
	Dispatch,
	SetStateAction
} from "react";

import { WSClientType } from "@/helpers/wsclient";

export interface Player {
	name: string;
	addr: string;
	color: number;
	number: number;
	symbol: string,
}

interface SocketContextValue {
	playerState: {
		players: Player[],
		client: number
	},
	wsclient: WSClientType | null,
	setWsclient: Dispatch<SetStateAction<WSClientType | null>>,
	updatePlayerState : Dispatch<SetStateAction<{ players: Player[], client: number }>>,
	sendRequest: boolean,
	setSendRequest: Dispatch<SetStateAction<boolean>>,
	requestRematch: boolean,
	setRequestRematch: Dispatch<SetStateAction<boolean>>,
	disconnected: boolean,
	setDisconnected: Dispatch<SetStateAction<boolean>>,
	rematchIndex: number,
	setRematchIndex: Dispatch<SetStateAction<number>>,
	continueIndex: number,
	setContinueIndex: Dispatch<SetStateAction<number>>,
	sendContinueRequest: boolean,
	setSendContinueRequest: Dispatch<SetStateAction<boolean>>
	isFull: string,
	setIsFull: Dispatch<SetStateAction<string>>,
	timerState: string,
	setTimerState: Dispatch<SetStateAction<string>>
	chipDisappear: boolean,
	setChipDisappear: Dispatch<SetStateAction<boolean>>
};

export const SocketContext = createContext<SocketContextValue>({} as SocketContextValue);

export const Socket: React.FC<{ initialWsClient?: WSClientType | null, children: ReactNode }> = ({ initialWsClient, children }) => {
	const [wsclient, setWsclient] = useState( initialWsClient !== undefined ? initialWsClient : null);
	const [sendRequest, setSendRequest] = useState(false);
	const [requestRematch, setRequestRematch] = useState(false);
	const [disconnected, setDisconnected] = useState(false);
	const [rematchIndex, setRematchIndex] = useState(0);
	const [continueIndex, setContinueIndex] = useState(0);
	const [sendContinueRequest, setSendContinueRequest] = useState(false);
	const [chipDisappear, setChipDisappear] = useState(false);
	const [isFull, setIsFull] = useState("");
	const [timerState, setTimerState] = useState("");
	const [playerState, setPlayerState] = useState({
		players: Array.from({ length: 3 }, () => ({
			name: "None",
			addr: "UNDEFINED",
			color: 0xffffff,
			number: -1,
			symbol: "",
		})),
		client: -1
	});

	const updatePlayerState : Dispatch<SetStateAction<{ players: Player[], client: number }>>  = ( newState ) => {
		setPlayerState((prevState) => ({
			...prevState,
			...newState,
		}));
	};

	const value : SocketContextValue = {
		wsclient,
		setWsclient,
		sendRequest,
		setSendRequest,
		requestRematch,
		setRequestRematch,
		disconnected,
		setDisconnected,
		rematchIndex,
		setRematchIndex,
		playerState,
		updatePlayerState,
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
