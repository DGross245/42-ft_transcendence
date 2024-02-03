"use client"

import { GameState } from './context/TTTGameState';
import { Socket } from './context/TTTSockets';
import TTTScene from './scene/TTTScene';

export default function TicTacToePage() {
	return (
		<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80svh' }}>
			<div>
				<GameState gameMode={true} isBotActive={true}>
					<Socket>
						<TTTScene />
					</Socket>
				</GameState>
			</div>
		</div>
	);
}