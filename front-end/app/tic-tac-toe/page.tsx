"use client"

import React, { useState, useEffect } from 'react';
import { title } from "@/components/primitives";
import TTTScene from "./TicTacToeScene";
import EndModal from "./components/EndModal";

export default function TicTacToePage() {
	const [showModal, setShowModal] = useState(false);
	const openModal = () => {
		setShowModal(true);
	};

	const closeModal = () => {
		setShowModal(false);
	};

	useEffect(() => {
		// You can use some conditions or events to trigger the modal appearance
		// For example, after a certain time delay, fetch data, or other events
		const timeout = setTimeout(() => {
		  openModal();
		}, 3000); // Show modal after 3 seconds (for example)
	
		return () => clearTimeout(timeout);
	}, []);

	return (
		<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80svh' }}>
			<div>
				<TTTScene />
				<EndModal isOpen={showModal} onClose={closeModal} />
			</div>
		</div>
	);
}