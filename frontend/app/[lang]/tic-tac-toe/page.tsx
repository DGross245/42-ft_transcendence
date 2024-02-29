"use client"

import { GameState } from './context/TTTGameState';
import { Socket } from './context/TTTSockets';
import TTTScene from './scene/TTTScene';

export default function TicTacToePage() {
	return (
		<div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
			<GameState gameMode={false} isBotActive={false}>
				<Socket>
					<TTTScene />
				</Socket>
			</GameState>
		</div>
	);
}