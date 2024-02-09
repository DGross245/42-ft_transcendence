import { PongGameState } from "./context/PongGameState";
import { PongSocket } from "./context/PongSockets";
import OneForAllScene from "./scene/OneForAllScene";
import PongScene from "./scene/PongScene";

export default function PongPage() {
	const gameMode = true;

	return (
		<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
			<div>
				<PongGameState gameMode={gameMode} isBotActive={false}>
					<PongSocket>
						{ gameMode ? (<OneForAllScene />) : (<PongScene />) }
					</PongSocket>
				</PongGameState>
			</div>
		 </div>
	);
}

