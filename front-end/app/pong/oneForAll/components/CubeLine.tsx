import { BoxGeometry, MeshBasicMaterial } from 'three'

/**
 * Generates Three.js cube components arranged diagonally,
 * representing a line splitting the game field into two parts along the Y-axis.
 * @returns A group of cube meshes forming a diagonal line.
 */
export const CubeLineY = () => {
	const cubes = [];
  
	for (let i = 1; i < 20; i++) {
		const positionY = i * (151 * 2) / 20 - 151;
		const positionX = i * (151 * 2) / 20 - 151;

		const cube = (
			<mesh key={i} position={[positionX, positionY, -4]}>
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
		const positionY = -i * (151 * 2) / 20 + 151;

		const cube = (
			<mesh key={i} position={[positionX, positionY, -4]}>
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
