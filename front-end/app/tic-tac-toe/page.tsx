"use client"

import React, { useState, useEffect } from 'react';
import { title } from "@/components/primitives";
import TTTScene from "./TicTacToeScene";
import EndModal from "./components/EndModal";

export default function TicTacToePage() {
	const [showModal, setShowModal] = useState(false);
	const [gameOver, setGameOver] = useState(false);

	const openModal = () => {
		setShowModal(true);
	};

	const closeModal = () => {
		setShowModal(false);
	};

	useEffect(() => {
		if (gameOver) {
			const delay = 2000;
			const modalTimeout = setTimeout(() => {
				openModal();
			}, delay);

			return () => clearTimeout(modalTimeout);
		}
	}, [gameOver]);

	return (
		<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80svh' }}>
			<div>
				<TTTScene gameOver={gameOver} setGameOver={setGameOver}/>
				<EndModal isOpen={showModal} onClose={closeModal} />
			</div>
		</div>
	);
}