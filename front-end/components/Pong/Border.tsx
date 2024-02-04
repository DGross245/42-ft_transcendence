
/**
 * Creates multiple Three.js meshes representing 3D borders that cover the corners of the playing area within a 3D space.
 * @returns An array of Three.js border meshes.
 */
export const CornerBorder = () => {

	// All positions and rotations for each border
	const info = [
		{ position: {x: 131, y: 0, z:-151}, rotation: {x: 0, y: 0, z: 0} },
		{ position: {x: 151, y: 0, z:-131}, rotation: {x: 0, y: Math.PI / 2, z: 0} },
		{ position: {x:-131, y: 0, z:-151}, rotation: {x: 0, y: 0, z: 0} },
		{ position: {x:-151, y: 0, z:-131}, rotation: {x: 0, y: Math.PI / 2, z: 0} },
		{ position: {x:-131, y: 0, z: 151}, rotation: {x: 0, y: 0, z: 0} },
		{ position: {x:-151, y: 0, z: 131}, rotation: {x: 0, y: Math.PI / 2, z: 0} },
		{ position: {x: 131, y: 0, z: 151}, rotation: {x: 0, y: 0, z: 0} },
		{ position: {x: 151, y: 0, z: 131}, rotation: {x: 0, y: Math.PI / 2, z: 0} },
	];

	const borders = info.map((border, index) => (
		<mesh
			key={index}
			position={[border.position.x, border.position.y, border.position.z]}
			rotation={[border.rotation.x, border.rotation.y, border.rotation.z]} >
			<boxGeometry args={[40, 4, 4]} />
			<meshBasicMaterial color={ 0xffffff } />
		</mesh>
	));

	return (borders);
}

/**
 * Creates a Three.js mesh representing a 3D border within a 3D space.
 * @param position - The position of the boarder in the 3D space.
 * @returns A Three.js mesh representing the border.
 */
export const LongBorder = ({ position }: {position: [number, number, number]}) => {
	return (
		<mesh position={position}>
			<boxGeometry args={[306, 4, 4]}/>
			<meshBasicMaterial color={ 0xffffff } />
		</mesh>
	);
}