import { useSound } from "@/components/Sound";
import { Line } from "@react-three/drei";
import { useEffect } from "react";

interface FinishLineProps {
	colour: number,
	visible: boolean;
	coords: [number, number, number][];
}

/**
 * The `FinishLine` component renders a line with specified coordinates and color, and plays a sound
 * when it becomes visible.
 * @param props - The `props` parameter is an object that contains the properties passed to the
 * `FinishLine` component. These properties can be accessed using dot notation, such as
 * `props.visible`, `props.coords`, and `props.colour`.
 * @returns The component is returning a `<mesh>` element with a `<Line>` component inside it. The
 * visibility of the `<mesh>` element is determined by the `props.visible` value. The `<Line>`
 * component is rendered with the specified `points`, `color`, and `lineWidth` props.
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