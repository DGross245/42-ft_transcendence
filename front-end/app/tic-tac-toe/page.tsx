"use client"

import React, { useState, useEffect } from 'react';
import TTTScene from "./normal/TicTacToeScene";
import QubicScene from './qubic/QubicScene';
import { TTTProvider } from './TTTProvider';
import TTTSceneTEST from './scene/TTTScene';
import { GameState } from './context/GameState';
import { Socket } from './context/Sockets';
import QubicSceneTEST from './scene/QubicScene';

export default function TicTacToePage() {
	return (
		<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80svh' }}>
			<div>
				<GameState gameMode={true} >
					<Socket>
						<QubicSceneTEST />
					</Socket>
				</GameState>
			</div>
		</div>
	);
}
//export default function TicTacToePage() {
//	return (
//		<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80svh' }}>
//			<div>
//				<TTTProvider>
//					<TTTScene />
//				</TTTProvider>
//			</div>
//		</div>
//	);
//}
