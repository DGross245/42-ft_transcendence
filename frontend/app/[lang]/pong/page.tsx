"use client"

import { useState } from "react";
import { PongGameState } from "./context/PongGameState";
import { PongSocket } from "./context/PongSockets";
import OneForAllScene from "./scene/OneForAllScene";
import PongScene from "./scene/PongScene";
import SelectionModal, { GameOptions } from "../modals/SelectionModal";

export default function PongPage() {
	const [gameOptions, setGameOptions] = useState<GameOptions>({ gameMode: false, isBotActive: false, botStrength: 0.5});
	const [open, setOpen] = useState(true);
	const [tournament, setTournament] = useState({ id: -1, index: -1 });

	return (
		<div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
				<PongGameState gameMode={gameOptions.gameMode} isBotActive={gameOptions.isBotActive} strength={gameOptions.botStrength * 200} tournament={tournament} setTournament={setTournament}>
					<PongSocket>
					<SelectionModal isOpen={open} setOpen={setOpen} onClose={() => setOpen(false)} gameType={"Pong"} setGameOptions={setGameOptions} tournamentState={tournament} />
						{ gameOptions.gameMode ? (<OneForAllScene />) : (<PongScene />) }
					</PongSocket>
				</PongGameState>
		 </div>
	);
}

