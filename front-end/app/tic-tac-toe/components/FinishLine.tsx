import { Line } from "@react-three/drei";
import { useRef, useState } from "react";
import { EffectComposer, SelectiveBloom } from '@react-three/postprocessing'
import { BlurPass, Resizer, KernelSize } from 'postprocessing'
import * as THREE  from 'three'
import { Mesh, Object3D } from 'three'

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