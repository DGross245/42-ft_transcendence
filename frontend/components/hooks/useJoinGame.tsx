import useContract from "./useContract";
import { WSClientType } from "@/helpers/wsclient";

export const useJoinEvents = (wsclient: WSClientType | null) => {
	const {
		createTournament,
		setNameAndColor,
		joinTournament,
		startTournament,
	} = useContract();
	
	const onCreateTournament = async (gameType: string) => {
		const result = await createTournament(300000000, gameType);
		if (!result) {
			return (1)
		} else {
			return (0);
		}
	}
	
	const onStartTournament = async (id: number, gameType: string) => {
		const result = await startTournament(id);
		if (!result) {
			return (1);
		} else {
			wsclient?.requestTournament(id, gameType);
			return (0);
		}
	}
	
	const onNextMatch = async (id: number, gameType: string) => {
		wsclient?.requestTournament(id, gameType);
	}

	const onSetNameAndColor = async (username: string, color: string) => {
		const result = await setNameAndColor(username, color);
		if (!result) {
			return (1);
		} else {
			return (0);
		}
	}
	
	const onCreateCustom = (gameMode: string) => {
		wsclient?.createGame(gameMode);
	}
	
	const onJoinQueue = (gameType: string) => {
		wsclient?.joinQueue(gameType)
	}

	const onJoinTournament = async (id: number, skip: boolean) =>  {
		if (!skip) {
			const result = await joinTournament(id);
			if (!result) {
				return (1);
			}
		}
		wsclient?.joinTournament(id);
		return (0);
	}

	return {
		onJoinQueue,
		onCreateCustom,
		onSetNameAndColor,
		onNextMatch,
		onStartTournament,
		onCreateTournament,
		onJoinTournament
	};
}