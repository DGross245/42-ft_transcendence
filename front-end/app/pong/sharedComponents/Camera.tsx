import { PerspectiveCamera } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from 'three'

interface CameraProps {
	position: [number, number, number],
	rotation: [number, number, number],
}

/**
 * Ceates a perspective camera for a 3D scene and updates its position and orientation based on a key map.
 * @param props - The `props` parameter is an object that contains the following properties:
 * 				  `keyMap` and `position`. 
 * @returns The PerspectiveCamera component from the Three.js library.
 */
const Camera : React.FC<CameraProps> = (props) => {
	const ref = useRef<THREE.PerspectiveCamera>(null);
	const [x, y, z] = [...props.position]; // TODO: REMOVE THIS LATER AFTER TESTING

	// Pressing on the Digit1 key, resets the camera back to its original spot.
	// useFrame(() => {
	// 	if (ref && ref.current) {
	// 		if (keyMap['Digit1']) {
	// 			ref.current.position.set(...props.position);
	// 			ref.current.lookAt(0, 0, 0);
	// 		}
	// 		// for testing
	// 		if (keyMap['Digit2']) {
	// 			const [x, y, z] = [...props.position];
	// 			ref.current.position.set(x, y, z + 300);
	// 			ref.current.lookAt(0, 0, 0);
	// 		}
	// 	}
	// });)

	//rotation={[0, 0, 0]} BLUE
	//rotation={[0, 0, Math.PI / 2]} RED 
	//rotation={[0, 0, Math.PI]} YELLOW
	//rotation={[0, 0, Math.PI / -2]} GREEN 
	return (
		<PerspectiveCamera
			makeDefault
			ref={ref}
			fov={60}
			aspect={window.innerWidth / window.innerHeight}
			near={0.1}
			far={1000}
			position={[x, y, z + 300]}
		/>
	);
}

export default Camera;