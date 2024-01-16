import { ReactNode, createContext, useState } from 'react';
import { Dispatch, SetStateAction } from 'react';

const initialBallState = {
	position: { x: 0, y: 0 },
	velocity: { x: 0, y: 0 },
};

const initialPaddleState = {
	keyMap: {
		'KeyW': false,
		'KeyS': false,
	},
};

const initialPlayerState = {
	// socket
	// name?
	color: 0xffffff,
};

const initialOpponentState = {
	// socket
	// name?
	color: 0xffffff,
};

interface PongContextProps {
	ballState: {
		position: { x: number, y: number },
		velocity: { x: number, y: number },
	};
	paddleState: {
		keyMap: { [key: string]: boolean };
	}
	playerState: {
		// socket
		color: number;
	}
	opponentState: {
		// socket
		color: number;
	}
	updateBallState: Dispatch<SetStateAction<typeof initialBallState>>;
	updatePaddleState: Dispatch<SetStateAction<typeof initialPaddleState>>;
	updatePlayerState :  Dispatch<SetStateAction<typeof initialPlayerState>>;
	updateOpponentState :  Dispatch<SetStateAction<typeof initialOpponentState>> 
}

const PongContext = createContext<PongContextProps | undefined>(undefined);

const PongProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [ballState, setBallState] = useState( initialBallState );
	const [paddleState, setPaddleState] = useState( initialPaddleState );
	const [playerState, setPlayerState] = useState( initialPlayerState ); // could be moved to another provider, like for all games
	const [opponentState, setOpponentState] = useState( initialOpponentState );  // this too

	const updateBallState : Dispatch<SetStateAction<typeof initialBallState>> = ( newState ) => {
		setBallState(prevState => ({
			...prevState,
			...newState,
		}));
	};

	const updatePaddleState : Dispatch<SetStateAction<typeof initialPaddleState>> = ( newState ) => {
		setPaddleState((prevState) => ({
			...prevState,
			...newState,
		}));
	};

	const updatePlayerState :  Dispatch<SetStateAction<typeof initialPlayerState>>  = ( newState ) => {
		setPlayerState((prevState) => ({
			...prevState,
			...newState,
		}));
	};

	const updateOpponentState :  Dispatch<SetStateAction<typeof initialOpponentState>>  = ( newState ) => {
		setOpponentState((prevState) => ({
			...prevState,
			...newState,
		}));
	};

	return (
		<PongContext.Provider
			value={{
				ballState, updateBallState, 
				paddleState, updatePaddleState, 
				playerState, updatePlayerState,
				opponentState, updateOpponentState,
			}}
		>
			{children}
		</PongContext.Provider>
	);
}

export { PongProvider, PongContext };