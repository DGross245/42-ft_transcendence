import * as THREE from 'three';

interface FloorProps {
	position: [number, number, number],
	args: [number, number, number],
}

/**
 * The Floor component is a mesh that represents a floor in a 3D scene, with customizable position,
 * size, and material properties.
 * @param props
 * @returns A mesh with a boxGeometry representing the floor.
 */
const Floor : React.FC<FloorProps> = (props) => {
	return (
		<mesh position={props.position} rotation={[0, 0, Math.PI / 2]}>
			<boxGeometry args={props.args} />
			<meshStandardMaterial
				color={0x111111}
				transparent={true}
				metalness={0.8}
				side={THREE.BackSide}
				opacity={0.5}
				roughness={0.9}
			/>
		</mesh>
	);
}

export default Floor;