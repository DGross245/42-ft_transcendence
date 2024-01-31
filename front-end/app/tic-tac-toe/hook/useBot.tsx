import { useEffect, useMemo } from "react"
import { useGameState } from "./useGameState"
import { TicTacToeBot } from "@/components/TTT/TicTacToeBot";
import { useSocket } from "./useSocket";

const BOT_ACTIVE = true;

export const useBot = () => {
	const { gameState, currentTurn, board, setBoard ,isGameMode, botState, setBot } = useGameState();
	const { playerState, wsclient, updatePlayerState } = useSocket();

	const SymbolArray = useMemo(() => [
		playerState.players[0].symbol,
		playerState.players[1].symbol,
		...(playerState.players[2].symbol !== '' ? [playerState.players[2].symbol] : [])
	],[playerState.players[0].symbol,playerState.players[1].symbol,playerState.players[2].symbol]);

	useEffect(( ) => {
		if (currentTurn === botState.symbol)
			TicTacToeBot(board, SymbolArray, botState.symbol, botState.strength, setBoard );
	},[currentTurn, botState])

	useEffect(() => {
		const joinTheGame = async () => {
			if (wsclient && botState.symbol === 'NOT DEFINED') {
				const { numClients, isBot } = await wsclient.joinGame(gameState.gameId, isGameMode ? "Qubic" : "TicTacToe", BOT_ACTIVE);
				let newPlayerData = { ...playerState };

				if (isBot) {
					newPlayerData.players[numClients] = {
						name: "BOT",
						color: 0xff0000,
						number: numClients,
						symbol: numClients === 0 ? 'X' : numClients === 1 ? 'O' : '🔳',
					}
					newPlayerData.client = numClients
					console.log("BOT IS CLIENT", numClients)
					updatePlayerState( newPlayerData );
					setBot({ ...botState, symbol: newPlayerData.players[numClients].symbol})
				}
			}
		}

		if (botState.isActive && wsclient)
			joinTheGame();
	},[botState.isActive, wsclient])
}