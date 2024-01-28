"use client"

import React, { useState, useEffect } from 'react';
import TTTScene from "./normal/TicTacToeScene";
import QubicScene from './qubic/QubicScene';
import { TTTProvider } from './TTTProvider';

export default function TicTacToePage() {
	return (
		<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80svh' }}>
			<div>
				<TTTProvider>
					<TTTScene />
				</TTTProvider>
			</div>
		</div>
	);
}