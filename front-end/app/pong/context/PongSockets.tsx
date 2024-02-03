import { WSClientType } from "@/helpers/wsclient";
import { Dispatch, ReactNode, SetStateAction, createContext, useState } from "react";

interface PongPlayer {
	name: string,
	color: number,
	rotation: [number, number, number],
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
};

export const PongSocketContext = createContext<PongSocketContextValue>({} as PongSocketContextValue);

export const PongSocket: React.FC<{ initialWsClient?: WSClientType | null, children: ReactNode }> = ({ initialWsClient, children }) => {
	const [wsclient, setWsclient] = useState( initialWsClient !== undefined ? initialWsClient : null);
	const [sendRequest, setSendRequest] = useState(false);
	const [requestRematch, setRequestRematch] = useState(false);
	const [disconnected, setDisconnected] = useState(false);
	const [rematchIndex, setRematchIndex] = useState(0);
	const [playerState, setPlayerState] = useState({
		players: Array.from({ length: 4 }, () => ({
			name: "None",
			color: 0xffffff,
			rotation: [ 0, 0, 0] as [number, number, number],
		})),
		client: -1,
		master: false
	});

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
		setPlayerState
	}

	return (
		<PongSocketContext.Provider value={ value } >
			{children}
		</PongSocketContext.Provider>
	)
}