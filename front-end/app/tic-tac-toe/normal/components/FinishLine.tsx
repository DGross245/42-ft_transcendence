import { Line } from "@react-three/drei";

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

   //if (props.visible) {
   //	if (props.winningCoords[0][1] != props.winningCoords[2][1] &&
   //		props) {
   //		;
   //	} else if (
   //			props.winningCoords[0][2] == 0 && 
   //			props.winningCoords[2][2] == 0) {
   //		console.log("kek2")
   //		props.winningCoords[0][0] -= 1.5;
   //		props.winningCoords[2][0] += 1.5;
   //	} else if (
   //		props.winningCoords[0][0] == 0 && 
   //			props.winningCoords[2][0] == 0) {
   //		props.winningCoords[0][2] -= 1.5;
   //		props.winningCoords[2][2] += 1.5;
   //	} else if (
   //			props.winningCoords[0][0] == props.winningCoords[0][2] &&
   //			props.winningCoords[2][0] == props.winningCoords[2][2]) {
   //				props.winningCoords[0][0] -= 1.5;
   //				props.winningCoords[0][2] -= 1.5;
   //				props.winningCoords[2][0] += 1.5;
   //				props.winningCoords[2][2] += 1.5;
   //				console.log("kek3")
   //	} else if (
   //			props.winningCoords[0][2] == 0 && 
   //			props.winningCoords[2][0] == 0) {
   //		props.winningCoords[0][0] -= 1.5;
   //		props.winningCoords[2][0] += 1.5;
   //		console.log("kek4")
   //	} else if (props.winningCoords[0][0] == -props.winningCoords[2][0]) {
   //		props.winningCoords[0][0] -= 1.5;
   //		props.winningCoords[2][0] += 1.5;
   //		props.winningCoords[0][2] += 1.5;
   //		props.winningCoords[2][2] -= 1.5;
   //		console.log("kek5")
   //	} else {
   //		props.winningCoords[0][2] -= 1.5;
   //		props.winningCoords[2][2] += 1.5;
   //		console.log("kek6")
   //	}
   //}