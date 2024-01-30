"use client"

import { GameState } from './context/GameState';
import { Socket } from './context/Sockets';
import TTTScene from './scene/TTTScene';

export default function TicTacToePage() {
	return (
		<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80svh' }}>
			<div>
				<GameState gameMode={false} >
					<Socket>
						<TTTScene />
					</Socket>
				</GameState>
			</div>
		</div>
	);
}