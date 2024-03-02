import { useSocket } from "@/app/[lang]/tic-tac-toe/hooks/useSocket";
import useContract from "./hooks/useContract";
import { useGameState } from "@/app/[lang]/tic-tac-toe/hooks/useGameState";
import { useEffect } from "react";

export const JoinGame : React.FC<{ selected: string }> = ({ selected }) => {
	const { wsclient } = useSocket();
	const {
		createTournament,
		setNameAndColor,
		joinTournament,
		startTournament,
		getTournaments,
		getRankedGames
	} = useContract();
	const {gameState, updateGameState, botState} = useGameState();

	// const onCreateTournament = async () => {
	// 	await createTournament(300000000);
	// 	setTopic((await getTournaments()).length - 1);
	// }

	const onSetNameAndColor = async () => {
		await setNameAndColor('KEK', '0xffffff');
	}

	// const onJoinTournament = async () =>{
	// 	await joinTournament(topic);
	// 	wsclient?.joinTournament(topic);
	// }

	// const onStartTournament = async () => {
	// 	await startTournament(topic);
	// 	wsclient?.requestTournament(topic, 'TTT');
	// }

	// const onGetTournaments = async () => {
	// 	const t = await getTournaments();
	// 	console.log(t);
	// }

	// const onkek = () => {
	// 	wsclient?.requestTournament(topic, 'TTT');
	// }

	// const onJoin = () => {
	// 	wsclient?.joinTournament(topic);
	// }

	// const onJoinCustom = () => {
	// 	updateGameState({ gameId: String(topic) })
	// }

	const onCreate = async () => {
		wsclient?.createGame();
	}

	const joinQueue = () => {
		wsclient?.joinQueue("tictactoe")
	}

	useEffect(() => {
		if (selected) {
			if (selected === "tournament-modes") {
				return ; // TODO: NOT IMPLEMENTED
			} else if (selected === "singleplayer") {
				return ; // TODO: NOT IMPLEMENTED
			} else if (selected === "multiplayer") {
				return ; // TODO: NOT IMPLEMENTED
			} else if (selected === "matchmaking"){
				// TODO: NEED TO ADD THE CustomizeModal somewhere
				joinQueue();
			}
		}
	}, [selected]);

	return (null);
}