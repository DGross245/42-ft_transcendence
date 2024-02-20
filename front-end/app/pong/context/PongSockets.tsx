"use client"

import {
	Dispatch,
	ReactNode,
	SetStateAction,
	createContext,
	useState
} from "react";

import { WSClientType } from "@/helpers/wsclient";

interface PongPlayer {
	name: string,
	addr: string;
	color: number,
	number: number
};

interface PongSocketContextValue {
	playerState: {
		players: PongPlayer[],
		client: number,
		master: boolean
	},
	setPlayerState: Dispatch<SetStateAction<{ players: PongPlayer[], client: number, master: boolean }>>,
	wsclient: WSClientType | null,
	setWsclient: Dispatch<SetStateAction<WSClientType | null>>,
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

export const initialPongPlayerState = () => ({
	players: Array.from({ length: 4 }, () => ({
		name: "None",
		addr: 'UNDEFINED',
		color: 0xffffff,
		number: -1
	})),
	client: -1,
	master: false
})

export const PongSocketContext = createContext<PongSocketContextValue>({} as PongSocketContextValue);

export const PongSocket: React.FC<{ initialWsClient?: WSClientType | null, children: ReactNode }> = ({ initialWsClient, children }) => {
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
	const [playerState, setPlayerState] = useState(initialPongPlayerState());

	const value: PongSocketContextValue = {
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
		<PongSocketContext.Provider value={ value } >
			{children}
		</PongSocketContext.Provider>
	)
}