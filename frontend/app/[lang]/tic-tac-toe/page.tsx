"use client"

import { useEffect, useState } from 'react';

import SelectionModal, { GameOptions } from '../modals/SelectionModal';
import { GameState } from './context/TTTGameState';
import { Socket } from './context/TTTSockets';
import TTTScene from './scene/TTTScene';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { useRouter } from 'next/navigation';

export default function TicTacToePage() {
	const [gameOptions, setGameOptions] = useState<GameOptions>({ gameMode: false, isBotActive: false, botStrength: 0.5 });
	const [open, setOpen] = useState(true);
	const [selected, setSelected] = useState("");
	const { isConnected } = useWeb3ModalAccount();
	const router = useRouter();

	useEffect(() => {
		if (!isConnected) {
			router.replace('/');
		}
	}, [isConnected, router]);

	const joinTheGame = (selected: string) => {
		setSelected(selected);
		setOpen(false)
	}

	return (
		<div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
			<GameState gameMode={gameOptions.gameMode} isBotActive={gameOptions.isBotActive} strength={gameOptions.botStrength}>
				<Socket>
					<SelectionModal isOpen={open} onClose={() => setOpen(false)} gameType={"TTT"} setGameOptions={setGameOptions} />
					<TTTScene />
				</Socket>
			</GameState>
		</div>
	);
}