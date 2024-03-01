import { useEffect, useMemo } from "react"

import { TicTacToeBot } from "@/components/TTT/TicTacToeBot";
import { useSocket } from "@/app/[lang]/tic-tac-toe/hooks/useSocket";
import { useGameState } from "@/app/[lang]/tic-tac-toe/hooks/useGameState";

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

export const TTTBot = () => {
	//* ------------------------------- hooks ------------------------------ */
	const {
		currentTurn,
		board,
		setBoard,
		isGameMode,
		botState,
		setBot
	} = useGameState();
	const {
		playerState,
		wsclient,
		setPlayerState
	} = useSocket();

	//* ------------------------------- functions ------------------------------ */
	const SymbolArray = useMemo(() => [
		playerState.players[0].symbol,
		playerState.players[1].symbol,
		...(playerState.players[2].symbol !== "UNDEFINED" ? [playerState.players[2].symbol] : [])
	],[playerState.players]);

	//* ------------------------------- useEffects ------------------------------ */
	useEffect(( ) => {
		if (currentTurn === botState.symbol && botState.isActive) {
			TicTacToeBot(board, SymbolArray, botState.symbol, botState.strength, setBoard );
		}
	},[currentTurn, botState, SymbolArray, board, setBoard])

	// Function to simulate a bot joining the game as a player
	useEffect(() => {
		const joinTheGame = () => {
			if (wsclient && botState.symbol === 'NOT DEFINED') {
				const client = isGameMode ? 2 : 1;

				setPlayerState((prevState) => {
					const updatedPlayers = prevState.players.map((prevPlayer, index) => {
						if (index === client) {
							return {
								name: "BOT",
								addr: "0xBotBOB01245",
								color: 0xff0000,
								number: client,
								symbol: 'UNDEFINED'
							};
						} else {
							return ( prevPlayer );
						}
					});

					setBot({ ...botState, symbol: updatedPlayers[client].symbol, client: client })

					return { ...prevState, players: updatedPlayers };
				});
			}
		}

		if (botState.isActive && wsclient) {
			joinTheGame();
		}
	},[botState.isActive, wsclient, playerState, botState, isGameMode, setBot, setPlayerState])

	return (null);
}