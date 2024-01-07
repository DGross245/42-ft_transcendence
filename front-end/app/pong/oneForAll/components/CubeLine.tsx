import { BoxGeometry, MeshBasicMaterial } from 'three'

/**
 * Generates Three.js cube components arranged diagonally,
 * representing a line splitting the game field into two parts along the Y-axis.
 * @returns A group of cube meshes forming a diagonal line.
 */
export const CubeLineY = (props) => {
	const cubeGeometry = new BoxGeometry(3, 3, 0.5);
	const cubeMaterial = new MeshBasicMaterial({ color: 0x808080 });
	const cubes = [];
  
	for (let i = 1; i < 20; i++) {
		const positionY = i * (151 * 2) / 20 - 151;
		const positionX = i * (151 * 2) / 20 - 151;

		const cube = (
			<mesh key={i} geometry={cubeGeometry} material={cubeMaterial} position={[positionX, positionY, -4]} />
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
export const CubeLineX = (props) => {
	const cubeGeometry = new BoxGeometry(3, 3, 0.5);
	const cubeMaterial = new MeshBasicMaterial({ color: 0x808080 });
	const cubes = [];

	for (let i = 1; i < 20; i++) {
		const positionX = i * (151 * 2) / 20 - 151;
		const positionY = -i * (151 * 2) / 20 + 151;

		const cube = (
			<mesh key={i} geometry={cubeGeometry} material={cubeMaterial} position={[positionX, positionY, -4]} />
		)
		cubes.push(cube);
	}

	return (
		<group >
			{cubes}
		</group>
	);
}
