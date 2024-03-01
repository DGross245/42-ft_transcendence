/* -------------------------------------------------------------------------- */
/*                                  Interface                                 */
/* -------------------------------------------------------------------------- */

interface FloorProps {
	position: [number, number, number],
	args: [number, number, number],
}

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

/**
 * The Floor component is a React functional component that renders a box mesh with a transparent
 * material.
 * @param props - The `props` parameter is an object that contains the properties passed to the `Floor`
 * component. These properties can be accessed using dot notation, for example `props.position` and
 * `props.args`.
 * @returns The `Floor` component is returning a `mesh` element with a `boxGeometry` and a
 * `meshStandardMaterial`.
 */
const Floor : React.FC<FloorProps> = (props) => {
	return (
		<mesh position={props.position} rotation={[0, 0, Math.PI / 2]}>
			<boxGeometry args={props.args} />
			<meshStandardMaterial
				color={0x111111}
				transparent={true}
				metalness={0.8}
				opacity={0.7}
				roughness={0.9}
			/>
		</mesh>
	);
}

export default Floor;