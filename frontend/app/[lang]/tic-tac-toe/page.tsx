"use client";

import { useEffect, useState } from 'react';

import SelectionModal, { GameOptions } from '../modals/SelectionModal';
import { GameState } from './context/TTTGameState';
import { Socket } from './context/TTTSockets';
import TTTScene from './scene/TTTScene';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { useRouter } from 'next/navigation';
import { WSClientType } from '@/helpers/wsclient';

export default function TicTacToePage() {
	const [wsclient, setWsclient] = useState<WSClientType | null>(null);
	const [gameOptions, setGameOptions] = useState<GameOptions>({ gameMode: false, isBotActive: false, botStrength: 0.5 });
	const [open, setOpen] = useState(true);
	const [tournament, setTournament] = useState({ id: -1, index: -1 });
	const { isConnected } = useWeb3ModalAccount();
	const router = useRouter();

	useEffect(() => {
		if (!isConnected) {
			router.replace('/');
		}
	}, [isConnected, router]);

	return (
		<div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
			<GameState gameMode={gameOptions.gameMode} isBotActive={gameOptions.isBotActive} strength={gameOptions.botStrength} tournament={tournament} setTournament={setTournament} >
				<Socket wsclient={wsclient} setWsclient={setWsclient}>
					<SelectionModal wsclient={wsclient} isOpen={open} setOpen={setOpen} onClose={() => setOpen(false)} gameType={"TTT"} setGameOptions={setGameOptions} tournamentState={tournament} />
					<TTTScene />
				</Socket>
			</GameState>
		</div>
	);
}