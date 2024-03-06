"use client"

import { useState } from 'react';

import SelectionModal, { GameOptions } from '../modals/SelectionModal';
import { GameState } from './context/TTTGameState';
import { Socket } from './context/TTTSockets';
import TTTScene from './scene/TTTScene';

export default function TicTacToePage() {
	const [gameOptions, setGameOptions] = useState<GameOptions>({ gameMode: false, isBotActive: false, botStrength: 0.5 });
	const [open, setOpen] = useState(true);
	const [selected, setSelected] = useState("");

	const joinTheGame = (selected: string) => {
		setSelected(selected);
		setOpen(false)
	}

	return (
		<div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
			{/* <SelectionModal isOpen={open} onClose={joinTheGame} setGameOptions={setGameOptions} /> */}
			<GameState gameMode={gameOptions.gameMode} isBotActive={gameOptions.isBotActive}>
				<Socket>
					<TTTScene selected={selected} />
				</Socket>
			</GameState>
		</div>
	);
}