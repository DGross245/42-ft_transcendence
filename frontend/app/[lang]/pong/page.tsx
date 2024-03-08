import { useWeb3ModalAccount } from "@web3modal/ethers5/react";
import { PongGameState } from "./context/PongGameState";
import { PongSocket } from "./context/PongSockets";
import OneForAllScene from "./scene/OneForAllScene";
import { useRouter } from "next/navigation";
import PongScene from "./scene/PongScene";
import { useEffect } from "react";

export default function PongPage() {
	const { isConnected } = useWeb3ModalAccount();
	const router = useRouter();
	const gameMode = false;

	useEffect(() => {
		if (!isConnected) {
			router.replace('/');
		}
	}, [isConnected, router]);

	return (
		<div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
				<PongGameState gameMode={gameMode} isBotActive={true}>
					<PongSocket>
						{ gameMode ? (<OneForAllScene />) : (<PongScene />) }
					</PongSocket>
				</PongGameState>
		 </div>
	);
}

