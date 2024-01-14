import { useSound } from "@/components/Sound";
import { Line } from "@react-three/drei";
import { useEffect } from "react";

interface FinishLineProps {
	colour: number,
	visible: boolean;
	coords: [number, number, number][];
}

/**
 * The `FinishLine` component renders a line in a 3D scene with specified coordinates, color, and
 * visibility.
 * @param props
 * @returns A mesh component with a Line component inside it.
 */
const FinishLine: React.FC<FinishLineProps> = (props) => {
	const soundEngine = useSound();

	useEffect(() => {
		if (props.visible)
			soundEngine?.playSound("finish");
	}, [props.visible]);

	return (
		<mesh visible={props.visible}>
			<Line
				points={[props.coords[0], props.coords[1], props.coords[2], props.coords[3]]}
				color={props.colour}
				lineWidth={15}
			/>
		</mesh>
	);
}

export default FinishLine