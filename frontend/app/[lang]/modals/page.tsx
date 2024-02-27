"use client";

import { Button, useDisclosure } from "@nextui-org/react";
import GameModal, { GameResult } from "./GameModal";
import SelectionModal from "./SelectionModal";
import CustomizeModal from "./CutomizeModal";

export default function Home() {
	const {isOpen: gameOpen, onOpen: gameOnOpen, onClose: gameOnClose} = useDisclosure();
	const {isOpen: selectionOpen, onOpen: selectionOnOpen} = useDisclosure();
	const {isOpen: customOpen, onOpen: customOnOpen} = useDisclosure();

	return (
		<section className="flex gap-5 items-center justify-center h-full p-5 flex-wrap md:flex-nowrap">
			<GameModal isOpen={gameOpen} gameResult={GameResult.Paused} resume={() => {gameOnClose()}}/>
			<Button onPress={gameOnOpen}>Open Game Modal</Button>
			<SelectionModal isOpen={selectionOpen}/>
			<Button onPress={selectionOnOpen}>Open Selection Modal</Button>
			<CustomizeModal isOpen={customOpen} startGame={() => {}}/>
			<Button onPress={customOnOpen}>Open Customize Modal</Button>
		</section>
	)
}
