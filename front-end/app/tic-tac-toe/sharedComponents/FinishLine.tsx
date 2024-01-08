import { Line } from "@react-three/drei";

interface FinishLineProps {
	colour: number,
	coords: number[][],
	visible: boolean;
}
/**
 * The `FinishLine` component renders a line in a 3D scene with specified coordinates, color, and
 * visibility.
 * @param props
 * @returns A mesh component with a Line component inside it.
 */
const FinishLine: React.FC<FinishLineProps> = (props) => {
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