"use client"

import { useState } from 'react';

import SelectionModal, { GameOptions } from '../modals/SelectionModal';
import { GameState } from './context/TTTGameState';
import { Socket } from './context/TTTSockets';
import TTTScene from './scene/TTTScene';

export default function TicTacToePage() {
	const [gameOptions, setGameOptions] = useState<GameOptions>({ gameMode: false, isBotActive: false, botStrength: 0.5 });
	const [open, setOpen] = useState(true);
	const [tournament, setTournament] = useState({ id: -1, index: -1 });

	return (
		<div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
			<GameState gameMode={gameOptions.gameMode} isBotActive={gameOptions.isBotActive} strength={gameOptions.botStrength} tournament={tournament} setTournament={setTournament} >
				<Socket>
					<SelectionModal isOpen={open} setOpen={setOpen} onClose={() => setOpen(false)} gameType={"TTT"} setGameOptions={setGameOptions} tournamentState={tournament} />
					<TTTScene />
				</Socket>
			</GameState>
		</div>
	);
}