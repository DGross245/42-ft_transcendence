
/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

/**
 * Creates a line of Three.js cube components arranged vertically to represent
 * the middle line, splitting the game field in two.
 * @returns A group of cube mehses forming a line.
 */
export const CubeLine = () => {
	const cubes = [];

	for (let i = 1; i < 20; i++) {
		const positionZ = i * (105 * 2) / 20 - 105;
		const cube = (
			<mesh key={i} position={[0, -2.5, positionZ]} rotation={[Math.PI / 2, 0, 0]}>
				<boxGeometry args={[3, 3, 0.5]} />
				<meshBasicMaterial color={ 0x808080 } />
			</mesh>
		)
		cubes.push(cube);
	}

	return (
		<group>
			{cubes}
		</group>
	);
}

/**
 * Generates Three.js cube components arranged diagonally,
 * representing a line splitting the game field into two parts along the Y-axis.
 * @returns A group of cube meshes forming a diagonal line.
 */
export const CubeLineY = () => {
	const cubes = [];
  
	for (let i = 1; i < 20; i++) {
		const positionZ = i * (151 * 2) / 20 - 151;
		const positionX = i * (151 * 2) / 20 - 151;

		const cube = (
			<mesh key={i} position={[positionX, -4, positionZ]} rotation={[Math.PI / 2, 0, 0]}>
				<boxGeometry args={[3, 3, 0.5]} />
				<meshBasicMaterial color={ 0x808080 } />
			</mesh>
		)
		cubes.push(cube);
	}

	return (
		<group >
			{cubes}
		</group>
	);
}

/**
 * Generates Three.js cube components arranged diagonally,
 * representing a line splitting the game field into two parts along the X-axis.
 * @returns A group of cube meshes forming a diagonal line.
 */
export const CubeLineX = () => {
	const cubes = [];

	for (let i = 1; i < 20; i++) {
		const positionX = i * (151 * 2) / 20 - 151;
		const positionZ = -i * (151 * 2) / 20 + 151;

		const cube = (
			<mesh key={i} position={[positionX, -4, positionZ]} rotation={[Math.PI / 2, 0, 0]}>
				<boxGeometry args={[3, 3, 0.5]} />
				<meshBasicMaterial color={ 0x808080 } />
			</mesh>
		)
		cubes.push(cube);
	}

	return (
		<group >
			{cubes}
		</group>
	);
}
