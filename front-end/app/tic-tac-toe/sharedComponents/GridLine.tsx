/**
 * Creates a boxGeometry representing the grid line in a 3D scene with specified position and rotation.
 * @param props
 * @returns The GridLine component is returning a mesh element.
 */
const GridLine = (props) => {
	return (
		<mesh
			key={props.key}
			position={props.position}
			rotation={props.rotation}
			onPointerOver={(e) => { e.stopPropagation()}}
			onClick={(e) => {e.stopPropagation()}}
		>
			<boxGeometry args={props.args} />
			<meshBasicMaterial color={0x333333} />
		</mesh>
	);
}

export default GridLine;