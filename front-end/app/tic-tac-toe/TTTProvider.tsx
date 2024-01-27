"use client"

import { WSClientType } from "@/helpers/wsclient";
import {
	Dispatch,
	ReactNode,
	SetStateAction,
	createContext,
	useState
} from "react";

const initialGameState = {
	gameId: '',
	wsclient: null as WSClientType | null,
	pause: true,
};

interface Player {
	name: string;
	color: number;
	number: number;
	symbol: string,
}

interface TTTContextProps {
	playerState: {
		players: Player[],
		client: number
	},
	gameState: {
		gameId: string,
		wsclient: WSClientType | null,
		pause: boolean,
	},
	updatePlayerState : Dispatch<SetStateAction<{ players: Player[], client: number }>>,
	updateGameState :  Dispatch<SetStateAction<typeof initialGameState>>
}

const TTTContext = createContext<TTTContextProps>({} as TTTContextProps);

const TTTProvider : React.FC<{ children: ReactNode, initialWsClient?: WSClientType | null }> = ({ children, initialWsClient }) => {
	const [gameState, setGameState] = useState({ ...initialGameState, wsclient: initialWsClient !== undefined ? initialWsClient : null });
	const [playerState, setPlayerState] = useState({
		players: Array.from({ length: 3 }, () => ({
			name: "None",
			color: 0xffffff,
			number: -1,
			symbol: "",
		})),
		client: -1
	});

	const updateGameState : Dispatch<SetStateAction<typeof initialGameState>> = ( newState ) => {
		setGameState(prevState => ({
			...prevState,
			...newState,
		}));
	};

	const updatePlayerState : Dispatch<SetStateAction<{ players: Player[], client: number }>>  = ( newState ) => {
		setPlayerState((prevState) => ({
			...prevState,
			...newState,
		}));
	};

	return (
		<TTTContext.Provider
				value={{
					playerState, updatePlayerState,
					gameState, updateGameState,
				}}
		>
			{children}
		</TTTContext.Provider>
	);
};

export { TTTProvider, TTTContext };