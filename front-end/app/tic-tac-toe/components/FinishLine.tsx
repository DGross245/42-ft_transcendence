import { Line } from "@react-three/drei";

const FinishLine = (props) => {
 
	return (
		<mesh visible={props.visible}>
			<Line
				points={[props.winningCoords[0], props.winningCoords[1], props.winningCoords[2]]}
				color={props.colour}
				lineWidth={15}
			/>
		</mesh>
	)
}

export default FinishLine