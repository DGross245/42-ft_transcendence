"use client"

import { PongGameState } from "./context/PongGameState";
import { PongSocket } from "./context/PongSockets";
import OneForAllScene from "./scene/OneForAllScene";
import { useRouter } from "next/navigation";
import PongScene from "./scene/PongScene";
import { useEffect, useState } from "react";
import SelectionModal, { GameOptions } from "../modals/SelectionModal";
import { useWeb3ModalAccount } from "@web3modal/ethers5/react";
import { WSClientType } from "@/helpers/wsclient";

export default function PongPage() {
	const [wsclient, setWsclient] = useState<WSClientType | null>(null);
	const [gameOptions, setGameOptions] = useState<GameOptions>({ gameMode: false, isBotActive: false, botStrength: 0.5});
	const [open, setOpen] = useState(true);
	const [tournament, setTournament] = useState({ id: -1, index: -1 });
	const { isConnected } = useWeb3ModalAccount();
	const [gameID, setGameID] = useState("-1");
	const router = useRouter();

	useEffect(() => {
		if (!isConnected) {
			router.replace('/');
		}
	}, [isConnected, router]);

	return (
		<div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
				<PongGameState gameID={gameID} gameMode={gameOptions.gameMode} isBotActive={gameOptions.isBotActive} strength={gameOptions.botStrength} tournament={tournament} setTournament={setTournament}>
					<PongSocket wsclient={wsclient} setWsclient={setWsclient}>
					<SelectionModal setGameID={setGameID}  wsclient={wsclient} isOpen={open} setOpen={setOpen} onClose={() => setOpen(false)} gameType={"Pong"} setGameOptions={setGameOptions} tournamentState={tournament} />
						{ gameOptions.gameMode ? (<OneForAllScene />) : (<PongScene />) }
					</PongSocket>
				</PongGameState>
		 </div>
	);
}