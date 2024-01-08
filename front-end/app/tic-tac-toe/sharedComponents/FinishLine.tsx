import { Line } from "@react-three/drei";

/**
 * The `FinishLine` component renders a line in a 3D scene with specified coordinates, color, and
 * visibility.
 * @param props
 * @returns A mesh component with a Line component inside it.
 */
const FinishLine = (props) => {
	return (
		<mesh visible={props.visible}>
			<Line
				points={[props.coords[0], props.coords[1], props.coords[2]]}
				color={props.colour}
				lineWidth={15}
			/>
		</mesh>
	);
}

export default FinishLine