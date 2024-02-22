import { Line } from "@react-three/drei";
import { useEffect, useState } from "react";

import { useSound } from "@/components/hooks/Sound";
import { useGameState } from "../../app/tic-tac-toe/hooks/useGameState";
import { useSocket } from "@/app/tic-tac-toe/hooks/useSocket";

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
	const soundEngine = useSound();
	const [color, setColor] = useState(0x00ffff);
	const { winner, lineCoords, isGameMode } = useGameState();
	const { isLineVisible } = useGameState();
	const { disconnected } = useSocket();

	useEffect(() => {
		if (winner) {
			if (isGameMode)
				setColor(winner === 'X' ? 0xff0000 : winner === 'O' ? 0x1aabff : 0x008000 );
			else
				setColor(winner === 'X' ? 0xff0000 : 0x1aabff);
			if (!disconnected)
				soundEngine?.playSound("finish");
		} 
	}, [winner, disconnected, soundEngine, isGameMode])


	return (
		<mesh visible={isLineVisible}>
			<Line
				points={[lineCoords[0], lineCoords[1], lineCoords[2], lineCoords[3]]}
				color={color}
				lineWidth={15}
			/>
		</mesh>
	);
}

export default FinishLine