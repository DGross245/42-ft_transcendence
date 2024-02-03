/**
 * Creates a Three.js mesh representing a 3D border within a 3D space.
 * @param position - The position of the boarder in the 3D space.
 * @returns A Three.js mesh representing the border.
 */
export const Border = ({ position }: {position: [number, number, number]}) => {
	return (
		<mesh position={position}>
			<boxGeometry args={[306, 4, 4]}/>
			<meshBasicMaterial color={ 0xffffff } />
		</mesh>
	);
}