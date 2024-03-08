import useContract from "./hooks/useContract";
import { useGameState } from "@/app/[lang]/tic-tac-toe/hooks/useGameState";
import { WSClientType } from "@/helpers/wsclient";

export const useJoinEvents = (wsclient: WSClientType | null) => {
	const {
		createTournament,
		setNameAndColor,
		joinTournament,
		startTournament,
	} = useContract();
	const { updateGameState } = useGameState();
	
	const onCreateTournament = async (gameType: string) => {
		const number = await createTournament(300000000, gameType);
	}
	
	const onStartTournament = async (id: number, gameType: string) => {
		await startTournament(id);
		wsclient?.requestTournament(id, gameType);
	}
	
	const onNextMatch = async (id: number, gameType: string) => {
		wsclient?.requestTournament(id, gameType);
	}

	const onSetNameAndColor = async (username: string, color: string) => {
		return (await setNameAndColor(username, color));
	}
	
	const onCreateCustom = (gameMode: string) => {
		wsclient?.createGame(gameMode);
	}
	
	const onJoinQueue = (gameType: string) => {
		wsclient?.joinQueue(gameType)
	}

	const onJoinTournament = async (id: number, skip: boolean) =>  {
		if (!skip) {
			await joinTournament(id);
		}
		wsclient?.joinTournament(id);
	}

	const onJoinCustom = (id: number) => {
		updateGameState({ gameId: String(id) })
	}

	return {
		onJoinQueue,
		onCreateCustom,
		onSetNameAndColor,
		onNextMatch,
		onStartTournament,
		onCreateTournament,
		onJoinTournament,
		onJoinCustom
	};
}