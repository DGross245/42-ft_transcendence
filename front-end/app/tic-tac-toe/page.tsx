"use client"

import { title } from "@/components/primitives";
import TTTScene from "./TicTacToeScene";
import EndModal from "./components/EndModal";
import { useState } from "react";

export default function TicTacToePage() {
	return (
		<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80svh' }}>
			<div>
				<TTTScene />
			</div>
		</div>
	);
}

