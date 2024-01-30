import { useEffect, useMemo } from "react"
import { useGameState } from "./useGameState"
import { TicTacToeBot } from "@/components/TTT/TicTacToeBot";
import { useSocket } from "./useSocket";

export const useBot = (symbol: string, strength: number) => {
	const { currentTurn, board, setBoard , } = useGameState();
	const { playerState } = useSocket();

	const SymbolArray = useMemo(() => [
		playerState.players[0].symbol,
		playerState.players[1].symbol,
		...(playerState.players[2].symbol !== '' ? [playerState.players[2].symbol] : [])
	],[playerState.players[0].symbol,playerState.players[1].symbol,playerState.players[2].symbol]);

	useEffect(( ) => {
		if (currentTurn === symbol && playerState.client === 0)
			TicTacToeBot(board, SymbolArray, symbol, strength, setBoard );
	},[currentTurn])
}