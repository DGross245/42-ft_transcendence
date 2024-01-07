import { BoxGeometry, MeshBasicMaterial } from 'three'

/**
 * Creates a line of Three.js cube components arranged vertically to represent
 * the middle line, splitting the game field in two.
 * @returns A group of cube mehses forming a line.
 */
const CubeLine = () => {
	const cubeGeometry = new BoxGeometry(3, 3, 0.5);
	const cubeMaterial = new MeshBasicMaterial({ color: 0x808080 });
	const cubes = [];

	for (let i = 1; i < 20; i++) {
		const positionY = i * (105 * 2) / 20 - 105;
		const cube = (
			<mesh key={i} geometry={cubeGeometry} material={cubeMaterial} position={[0, positionY, -4]} />
		)
		cubes.push(cube);
	}

	return (
		<group>
			{cubes}
		</group>
	);
}

export default CubeLine