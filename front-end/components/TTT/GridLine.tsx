interface GridLineProps {
	position: [number, number, number],
	rotation: [number, number, number],
	args: [number, number, number],
}

/**
 * The GridLine component is a functional component in TypeScript React that renders a mesh with a box
 * geometry and a mesh basic material.
 * @param props - The `props` parameter is an object that contains the properties passed to the
 * `GridLine` component. These properties can be accessed using dot notation, for example
 * `props.position` and `props.rotation`.
 * @param key - The key parameter is used to uniquely identify each element in a list. It helps React
 * efficiently update and re-render the list when changes occur.
 * @returns The GridLine component is returning a mesh element with a boxGeometry and
 * meshBasicMaterial.
 */
const GridLine : React.FC<GridLineProps> = (props, key) => {
	return (
		<mesh
			key={key}
			position={props.position}
			rotation={props.rotation}
			onPointerOver={(e) => { e.stopPropagation()}}
			onClick={(e) => {e.stopPropagation()}}
		>
			<boxGeometry args={props.args} />
			<meshStandardMaterial color={0x333333} />
		</mesh>
	);
}

export default GridLine;