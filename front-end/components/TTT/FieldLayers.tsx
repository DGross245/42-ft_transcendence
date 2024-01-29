import { useGameState } from "../../app/tic-tac-toe/hook/useGameState";
import Field from "./Field";

export const FieldLayers = ({ clicked, click } : { clicked: boolean; click: React.Dispatch<React.SetStateAction<boolean>> }) => {
	const { gameState } = useGameState();
	const fields = [];
	let l = 0;
	const arrayPosition = [
		{ i: 0, j: 0, k: 0 }, { i: 0, j: 1, k: 0 }, { i: 0, j: 2, k: 0 }, { i: 0, j: 3, k: 0 },
		{ i: 0, j: 0, k: 1 }, { i: 0, j: 1, k: 1 }, { i: 0, j: 2, k: 1 }, { i: 0, j: 3, k: 1 },
		{ i: 0, j: 0, k: 2 }, { i: 0, j: 1, k: 2 }, { i: 0, j: 2, k: 2 }, { i: 0, j: 3, k: 2 },
		{ i: 0, j: 0, k: 3 }, { i: 0, j: 1, k: 3 }, { i: 0, j: 2, k: 3 }, { i: 0, j: 3, k: 3 },

		{ i: 1, j: 0, k: 0 }, { i: 1, j: 1, k: 0 }, { i: 1, j: 2, k: 0 }, { i: 1, j: 3, k: 0 },
		{ i: 1, j: 0, k: 1 }, { i: 1, j: 1, k: 1 }, { i: 1, j: 2, k: 1 }, { i: 1, j: 3, k: 1 },
		{ i: 1, j: 0, k: 2 }, { i: 1, j: 1, k: 2 }, { i: 1, j: 2, k: 2 }, { i: 1, j: 3, k: 2 },
		{ i: 1, j: 0, k: 3 }, { i: 1, j: 1, k: 3 }, { i: 1, j: 2, k: 3 }, { i: 1, j: 3, k: 3 },

		{ i: 2, j: 0, k: 0 }, { i: 2, j: 1, k: 0 }, { i: 2, j: 2, k: 0 }, { i: 2, j: 3, k: 0 },
		{ i: 2, j: 0, k: 1 }, { i: 2, j: 1, k: 1 }, { i: 2, j: 2, k: 1 }, { i: 2, j: 3, k: 1 },
		{ i: 2, j: 0, k: 2 }, { i: 2, j: 1, k: 2 }, { i: 2, j: 2, k: 2 }, { i: 2, j: 3, k: 2 },
		{ i: 2, j: 0, k: 3 }, { i: 2, j: 1, k: 3 }, { i: 2, j: 2, k: 3 }, { i: 2, j: 3, k: 3 },

		{ i: 3, j: 0, k: 0 }, { i: 3, j: 1, k: 0 }, { i: 3, j: 2, k: 0 }, { i: 3, j: 3, k: 0 },
		{ i: 3, j: 0, k: 1 }, { i: 3, j: 1, k: 1 }, { i: 3, j: 2, k: 1 }, { i: 3, j: 3, k: 1 },
		{ i: 3, j: 0, k: 2 }, { i: 3, j: 1, k: 2 }, { i: 3, j: 2, k: 2 }, { i: 3, j: 3, k: 2 },
		{ i: 3, j: 0, k: 3 }, { i: 3, j: 1, k: 3 }, { i: 3, j: 2, k: 3 }, { i: 3, j: 3, k: 3 },
	];

	for (let level = 0; level < 4; level++) {
		for (let i = -1; i < 3; i++) {
			for (let j = -1; j < 3; j++) {
				let x = 6 * i;
				let y = 8 * level;
				let z = 6 * j;
				const { i: fieldI, j: fieldJ, k: fieldK } = arrayPosition[l];
				fields.push(
						<Field
							key={`${fieldI}-${fieldJ}-${fieldK}`}
							position={[x,y,z]}
							clicked={gameState.gameOver ? gameState.gameOver : clicked}
							click={click}
							i={fieldI}
							j={fieldJ}
							k={fieldK}
						/>
				);
				l++;
			}
		}
	}
	return (fields);
}