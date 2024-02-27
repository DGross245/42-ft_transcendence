import { Line } from "@react-three/drei";
import { useEffect, useMemo, useState } from "react";

import { useSound } from "@/components/hooks/Sound";
import { useGameState } from "../../app/[lang]/tic-tac-toe/hooks/useGameState";
import { useSocket } from "@/app/[lang]/tic-tac-toe/hooks/useSocket";

/**
 * The `FinishLine` component renders a line with specified coordinates and color, and plays a sound
 * when it becomes visible.
 * @param props - The `props` parameter is an object that contains the properties passed to the
 * `FinishLine` component. These properties can be accessed using dot notation, such as
 * `props.visible`, `props.coords`, and `props.colour`.
 * @returns The component is returning a `<mesh>` element with a `<Line>` component inside it. The
 * visibility of the `<mesh>` element is determined by the `props.visible` value. The `<Line>`
 * component is rendered with the specified `points`, `color`, and `lineWidth` props.
 */
const FinishLine = () => {
	const playSound = useSound();
	const [color, setColor] = useState(0x00ffff);
	const { winner, lineCoords, isGameMode, isLineVisible, started } = useGameState();
	const { playerStatus, playerState } = useSocket();

	const colors = useMemo(() => {
		const getColorBySymbol = (symbol: string) => {
			const player = playerState.players.find(player => player.symbol === symbol);
			return player?.color;
		};

		return [
			getColorBySymbol('X'),
			getColorBySymbol('O'),
			getColorBySymbol('🔳'),
		];
	}, [playerState.players]);

	useEffect(() => {
		if (winner !== '' && started) {
			if (winner === 'X') {
				setColor(Number(colors[0]));
			} else if (winner === 'O') {
				setColor(Number(colors[1]));
			} else if (winner === '🔳') {
				setColor(Number(colors[2]));
			}
			if (!playerStatus) {
				playSound("finish");
			}
		} 
	}, [winner, playerStatus, isGameMode, colors, started, playSound])


	return (
		<mesh visible={isLineVisible}>
			<Line
				points={[lineCoords[0], lineCoords[1], lineCoords[2], lineCoords[3]]}
				color={color}
				lineWidth={10}
			/>
		</mesh>
	);
}

export default FinishLine