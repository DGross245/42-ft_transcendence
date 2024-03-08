"use client";

import { Button, useDisclosure } from "@nextui-org/react";
import GameModal, { GameResult } from "./GameModal";
// import SelectionModal from "./SelectionModal";
// import CustomizeModal from "./CutomizeModal";
import { useState } from "react";
import CustomizeModal from "./CutomizeModal";
import SelectionModal from "./SelectionModal";

export default function Home() {
	const {isOpen: gameOpen, onOpen: gameOnOpen, onClose: gameOnClose} = useDisclosure();
	const {isOpen: selectionOpen, onOpen: selectionOnOpen, onClose: selectionOnClose} = useDisclosure();
	const {isOpen: customOpen, onOpen: customOnOpen} = useDisclosure();

	const [currClients, setCurrClients] = useState(0);
	const onContinue = () => {
		setCurrClients((curr) => curr + 1);
		setTimeout(() => {
			setCurrClients((curr) => curr + 1);

			setTimeout(() => {
				gameOnClose();
			}, 2500);
		}, 2500);
	}

	return (
		<section className="flex gap-5 items-center justify-center h-full p-5 flex-wrap md:flex-nowrap">
			{/* Game Modal */}
			{/* <GameModal isOpen={gameOpen} gameResult={GameResult.Paused} pauseInfo={{
				onClick: onContinue,
				currentClients: currClients,
				maxClients: 2
			}}/> */}
			{/* <Button onPress={gameOnOpen}>Open Game Modal</Button> */}
			{/* Selection Modal */}
			<SelectionModal isOpen={selectionOpen} onClose={selectionOnClose}/>
			<Button onPress={selectionOnOpen}>Open Selection Modal</Button>
			{/* Customize Modal */}
			<CustomizeModal isOpen={customOpen} startGame={() => {}}/>
			<Button onPress={customOnOpen}>Open Customize Modal</Button>
		</section>
	)
}
