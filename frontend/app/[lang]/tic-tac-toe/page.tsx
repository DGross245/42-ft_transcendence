"use client"

import { useState } from 'react';

import SelectionModal, { GameOptions } from '../modals/SelectionModal';
import { GameState } from './context/TTTGameState';
import { Socket } from './context/TTTSockets';
import TTTScene from './scene/TTTScene';

export default function TicTacToePage() {
	const [gameOptions, setGameOptions] = useState<GameOptions>({ gameMode: false, isBotActive: false, botStrength: 0.5 });
	const [open, setOpen] = useState(true);

	return (
		<div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
			<GameState gameMode={gameOptions.gameMode} isBotActive={gameOptions.isBotActive} strength={gameOptions.botStrength}>
				<Socket>
					<SelectionModal isOpen={open} onClose={() => setOpen(false)} gameType={"TTT"} setGameOptions={setGameOptions} />
					<TTTScene />
				</Socket>
			</GameState>
		</div>
	);
}