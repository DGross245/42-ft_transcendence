import { useEffect, useMemo } from "react"

import { TicTacToeBot } from "@/components/TTT/TicTacToeBot";
import { useSocket } from "@/app/tic-tac-toe/hooks/useSocket";
import { useGameState } from "@/app/tic-tac-toe/hooks/useGameState";

export const TTTBot = () => {
	const { currentTurn, board, setBoard ,isGameMode, botState, setBot } = useGameState();
	const { playerState, wsclient, updatePlayerState } = useSocket();

	const SymbolArray = useMemo(() => [
		playerState.players[0].symbol,
		playerState.players[1].symbol,
		...(playerState.players[2].symbol !== '' ? [playerState.players[2].symbol] : [])
	],[playerState.players[0].symbol, playerState.players[1].symbol, playerState.players[2].symbol]);
	
	useEffect(( ) => {
		if (currentTurn === botState.symbol && botState.isActive) {
			TicTacToeBot(board, SymbolArray, botState.symbol, botState.strength, setBoard );
		}
	},[currentTurn, botState])

	// Function to simulate a bot joining the game as a player
	useEffect(() => {
		const joinTheGame = () => {
			if (wsclient && botState.symbol === 'NOT DEFINED') {
				let newPlayerData = { ...playerState };
				const client = isGameMode ? 2 : 1;
			
				newPlayerData.players[client] = {
					name: "BOT",
					addr: "0xBotBOB01245",
					color: 0xff0000,
					number: client,
					symbol: ''
				}
				updatePlayerState( newPlayerData );
				setBot({ ...botState, symbol: newPlayerData.players[client].symbol, client: client })
			}
		}

		if (botState.isActive && wsclient) {
			joinTheGame();
		}
	},[botState.isActive, wsclient, playerState])

	return (null);
}