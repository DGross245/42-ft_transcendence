import Field from "./Field";

export const FieldLayers = () => {
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

	const fieldArray= [];
	let l = 0;
	for (let level = 0; level < 4; level++) {
		for (let i = -1; i < 3; i++) {
			for (let j = -1; j < 3; j++) {
				let x = 6 * i;
				let y = 8 * level;
				let z = 6 * j;
				const { i: fieldI, j: fieldJ, k: fieldK } = arrayPosition[l];
				fieldArray.push(
					<Field
						key={`${fieldI}-${fieldJ}-${fieldK}`}
						position={[x,y,z]}
						i={fieldI}
						j={fieldJ}
						k={fieldK}
					/>
				);
				l++;
			}
		}
	}

	return ( fieldArray );
}