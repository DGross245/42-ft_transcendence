"use client"

import React, { useState, useEffect } from 'react';
import TTTScene from "./TicTacToeScene";

export default function TicTacToePage() {
	return (
		<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80svh' }}>
			<div>
				<TTTScene />
			</div>
		</div>
	);
}