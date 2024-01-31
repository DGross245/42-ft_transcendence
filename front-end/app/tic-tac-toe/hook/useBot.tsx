import { useEffect, useMemo } from "react"
import { useGameState } from "./useGameState"
import { TicTacToeBot } from "@/components/TTT/TicTacToeBot";
import { useSocket } from "./useSocket";

export const useBot = () => {
	const { currentTurn, board, setBoard ,isGameMode, botState, setBot } = useGameState();
	const { playerState, wsclient, updatePlayerState } = useSocket();

	const SymbolArray = useMemo(() => [
		playerState.players[0].symbol,
		playerState.players[1].symbol,
		...(playerState.players[2].symbol !== '' ? [playerState.players[2].symbol] : [])
	],[playerState.players[0].symbol,playerState.players[1].symbol,playerState.players[2].symbol]);

	useEffect(( ) => {
		if (currentTurn === botState.symbol) {
			console.log("KEK");
			TicTacToeBot(board, SymbolArray, botState.symbol, botState.strength, setBoard );
		}
	},[currentTurn, botState])

	useEffect(() => {
		const joinTheGame = () => {
			if (wsclient && botState.symbol === 'NOT DEFINED') {
				let newPlayerData = { ...playerState };
				const client = isGameMode ? 2 : 1;
			
				newPlayerData.players[client] = {
					name: "BOT",
					color: 0xff0000,
					number: client,
					symbol: isGameMode ? '🔳' : 'O'
				}
				updatePlayerState( newPlayerData );
				setBot({ ...botState, symbol: newPlayerData.players[client].symbol, client: client })
			}
		}

		if (botState.isActive && wsclient)
			joinTheGame();
	},[botState.isActive, wsclient, playerState])

}