import { PongGameState } from "./context/PongGameState";
import { PongSocket } from "./context/PongSockets";
import OneForAllScene from "./scene/OneForAllScene";
import PongScene from "./scene/PongScene";

export default function PongPage() {
	const gameMode = false;

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

